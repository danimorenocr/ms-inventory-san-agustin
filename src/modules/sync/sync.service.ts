import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient as PrismaCloudClient } from '@prisma/client';
import { PrismaLocalService } from '../../infraestructure/prisma/prisma-local.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly prisma: PrismaCloudClient;

  constructor(
    private readonly prismaLocal: PrismaLocalService, // Local SQLite / Postgres
  ) {
    this.prisma = new PrismaCloudClient({
      datasources: {
        db: {
          url: process.env.DATABASE_CLOUD_URL,
        },
      },
    });
  }

  /**
   * Guarda una operación en la base de datos local cuando no hay internet
   */
  async saveToSyncQueue(entity: string, action: string, payload: any) {
    this.logger.warn(`No hay internet. Guardando operación de ${entity} en la cola local (SQLite)...`);
    
    await this.prismaLocal.syncQueue.create({
      data: {
        entity,
        action,
        payload: JSON.stringify(payload),
      },
    });
    
    this.logger.log(`Operación guardada exitosamente en modo offline.`);
  }

  /**
   * CronJob que se ejecuta cada minuto para intentar sincronizar
   * los datos de la cola local (SQLite) hacia la nube (Postgres)
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async syncPendingOperations() {
    // 1. Buscar transacciones pendientes en SQLite
    const pendingTasks = await this.prismaLocal.syncQueue.findMany({
      where: { synced: false },
      orderBy: { createdAt: 'asc' },
    });

    if (pendingTasks.length === 0) {
      return; // Nada que sincronizar
    }

    this.logger.log(`🔄 Iniciando sincronización de ${pendingTasks.length} tareas pendientes a la nube...`);

    // 2. Comprobar si hay internet haciendo un query rápido a Postgres
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      this.logger.error(`❌ Sin conexión a internet. Sincronización pospuesta.`);
      return;
    }

    // 3. Procesar cada tarea pendiente
    for (const task of pendingTasks) {
      try {
        const payload = JSON.parse(task.payload);

        // Replicar la acción HTTP localmente
        if (task.entity === 'HttpRequest') {
          this.logger.log(`Re-ejecutando ${payload.method} ${payload.url}...`);
          
          const response = await fetch(`http://localhost:${process.env.PORT || 4001}${payload.url}`, {
            method: payload.method,
            headers: {
              'Content-Type': 'application/json',
              'X-Offline-Sync': 'true' // Evitar bucles infinitos si falla de nuevo
            },
            body: JSON.stringify(payload.body)
          });

          if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${await response.text()}`);
          }
        }

        // 4. Marcar como sincronizado en SQLite
        await this.prismaLocal.syncQueue.update({
          where: { id: task.id },
          data: { synced: true, syncedAt: new Date() },
        });

        this.logger.log(`✅ Tarea ${task.id} (${task.entity}) sincronizada.`);
      } catch (error) {
        this.logger.error(`❌ Error sincronizando tarea ${task.id}:`, error.message);
        // Si hay error en un payload específico, pasamos al siguiente
      }
    }
  }

  async pullRemoteChanges() {
    this.logger.log('📥 Iniciando descarga completa de datos desde Railway (Inventario)...');
    try {
      // 1. CategoriaBase
      const categorias = await this.prisma.categoriaBase.findMany();
      for (const cat of categorias) {
        await this.prismaLocal.categoriaBase.upsert({
          where: { id: cat.id },
          update: { tipoAnimal: cat.tipoAnimal, nombre: cat.nombre, estado: cat.estado },
          create: cat,
        });
      }
      this.logger.log(`⬇️ Pull: ${categorias.length} categorías base`);

      // 2. SubparteBase
      const subpartes = await this.prisma.subparteBase.findMany();
      for (const sub of subpartes) {
        await this.prismaLocal.subparteBase.upsert({
          where: { id: sub.id },
          update: {
            idCategoriaBase: sub.idCategoriaBase,
            nombre: sub.nombre,
            estado: sub.estado,
            reservaCombosKg: sub.reservaCombosKg,
            consumidoCombosKg: sub.consumidoCombosKg,
          },
          create: sub,
        });
      }
      this.logger.log(`⬇️ Pull: ${subpartes.length} subpartes base`);

      // 3. ProductoSalida
      const productos = await this.prisma.productoSalida.findMany();
      for (const prod of productos) {
        await this.prismaLocal.productoSalida.upsert({
          where: { id: prod.id },
          update: {
            nombre: prod.nombre,
            unidad: prod.unidad,
            precio: prod.precio,
            etiqueta: prod.etiqueta,
            activo: prod.activo,
          },
          create: prod,
        });
      }
      this.logger.log(`⬇️ Pull: ${productos.length} productos de salida`);

      // 4. ProductoSalidaComponente
      const componentes = await this.prisma.productoSalidaComponente.findMany();
      for (const comp of componentes) {
        await this.prismaLocal.productoSalidaComponente.upsert({
          where: { id: comp.id },
          update: {
            productoSalidaId: comp.productoSalidaId,
            subparteBaseId: comp.subparteBaseId,
            factorAsignacion: comp.factorAsignacion,
          },
          create: comp,
        });
      }
      this.logger.log(`⬇️ Pull: ${componentes.length} componentes de productos`);

      // 5. Procedencia
      const procedencias = await this.prisma.procedencia.findMany();
      for (const proc of procedencias) {
        await this.prismaLocal.procedencia.upsert({
          where: { id: proc.id },
          update: { nombre: proc.nombre },
          create: proc,
        });
      }
      this.logger.log(`⬇️ Pull: ${procedencias.length} procedencias`);

      // 6. Proveedor
      const proveedores = await this.prisma.proveedor.findMany();
      for (const prov of proveedores) {
        await this.prismaLocal.proveedor.upsert({
          where: { id: prov.id },
          update: {
            nombre: prov.nombre,
            tipoAnimal: prov.tipoAnimal,
            telefono: prov.telefono,
            ciudad: prov.ciudad,
            tipoProveedor: prov.tipoProveedor,
            direccion: prov.direccion,
            cedulaNit: prov.cedulaNit,
            correo: prov.correo,
            observacion: prov.observacion,
          },
          create: prov,
        });
      }
      this.logger.log(`⬇️ Pull: ${proveedores.length} proveedores`);

      // 7. Lote
      const lotes = await this.prisma.lote.findMany();
      for (const l of lotes) {
        await this.prismaLocal.lote.upsert({
          where: { id: l.id },
          update: {
            tipoIngreso: l.tipoIngreso,
            tipoAnimal: l.tipoAnimal,
            procedenciaId: l.procedenciaId,
            guia: l.guia,
            fotoGuia: l.fotoGuia,
            pesoKgInicial: l.pesoKgInicial,
            pesoKgActual: l.pesoKgActual,
            pesoKgLimpio: l.pesoKgLimpio,
            pesoArrobaLimpio: l.pesoArrobaLimpio,
            precioKg: l.precioKg,
            precioArroba: l.precioArroba,
            precioTotal: l.precioTotal,
            limpio: l.limpio,
            sexo: l.sexo,
            clasificacion: l.clasificacion,
            dientes: l.dientes,
            despostado: l.despostado,
            fechaIngreso: l.fechaIngreso,
            idUsuario: l.idUsuario,
            proveedorId: l.proveedorId,
          },
          create: l,
        });
      }
      this.logger.log(`⬇️ Pull: ${lotes.length} lotes`);

      // 8. CategoriaLote
      const catLotes = await this.prisma.categoriaLote.findMany();
      for (const cl of catLotes) {
        await this.prismaLocal.categoriaLote.upsert({
          where: { id: cl.id },
          update: {
            idLote: cl.idLote,
            idCategoriaBase: cl.idCategoriaBase,
            pesoCategoriaKg: cl.pesoCategoriaKg,
            fechaRegistro: cl.fechaRegistro,
          },
          create: cl,
        });
      }
      this.logger.log(`⬇️ Pull: ${catLotes.length} categorías de lotes`);

      // 9. SubparteLote
      const subLotes = await this.prisma.subparteLote.findMany();
      for (const sl of subLotes) {
        await this.prismaLocal.subparteLote.upsert({
          where: { id: sl.id },
          update: {
            idLote: sl.idLote,
            idCategoriaLote: sl.idCategoriaLote,
            idSubparteBase: sl.idSubparteBase,
            pesoSubparteKg: sl.pesoSubparteKg,
            fechaPesado: sl.fechaPesado,
          },
          create: sl,
        });
      }
      this.logger.log(`⬇️ Pull: ${subLotes.length} subpartes de lotes`);

      // 10. ProductoBase
      const bases = await this.prisma.productoBase.findMany();
      for (const b of bases) {
        await this.prismaLocal.productoBase.upsert({
          where: { id: b.id },
          update: {
            nombre: b.nombre,
            categoria: b.categoria,
            estado: b.estado,
            reservaCombosKg: b.reservaCombosKg,
            consumidoCombosKg: b.consumidoCombosKg,
          },
          create: b,
        });
      }
      this.logger.log(`⬇️ Pull: ${bases.length} productos base`);

      // 11. LoteIndividual
      const lotesIndiv = await this.prisma.loteIndividual.findMany();
      for (const li of lotesIndiv) {
        await this.prismaLocal.loteIndividual.upsert({
          where: { idLote: li.idLote },
          update: {
            idProductoBase: li.idProductoBase,
            pesoKg: li.pesoKg,
            precioKg: li.precioKg,
            precioTotal: li.precioTotal,
            unidades: li.unidades,
            fechaRegistro: li.fechaRegistro,
            procedenciaId: li.procedenciaId,
          },
          create: li,
        });
      }
      this.logger.log(`⬇️ Pull: ${lotesIndiv.length} lotes individuales`);

      this.logger.log('✅ Descarga completa de inventario desde la nube realizada exitosamente.');
    } catch (err) {
      this.logger.error('❌ Error al realizar la descarga de datos de inventario:', err.message);
    }
  }
}
