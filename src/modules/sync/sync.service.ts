import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient as PrismaCloudClient } from '@prisma/client';
import { PrismaLocalService } from '../../infraestructure/prisma/prisma-local.service';

@Injectable()
export class SyncService implements OnModuleInit {
  private readonly logger = new Logger(SyncService.name);
  private readonly prismaCloud: PrismaCloudClient;
  private syncing = false;
  private pullInProgress = false;
  private pullCompleted = false;
  private pullError: string | null = null;

  constructor(
    private readonly prismaLocal: PrismaLocalService, // Local SQLite — SIEMPRE disponible
  ) {
    this.prismaCloud = new PrismaCloudClient({
      datasources: {
        db: {
          url: process.env.DATABASE_CLOUD_URL || process.env.DATABASE_URL,
        },
      },
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  INICIO: Pull automático al arrancar el servicio
  // ═══════════════════════════════════════════════════════════

  async onModuleInit() {
    this.logger.log('🚀 Iniciando pull automático desde Railway al arrancar...');
    // Ejecutar en segundo plano para no bloquear el inicio del microservicio
    this.pullRemoteChanges().catch(err => {
      this.logger.error('❌ Error en el pull inicial:', err.message);
    });
  }

  getStatus() {
    return {
      pullInProgress: this.pullInProgress,
      pullCompleted: this.pullCompleted,
      pullError: this.pullError,
    };
  }

  // ═══════════════════════════════════════════════════════════
  //  OFFLINE-FIRST: Guardar operación en cola local (SQLite)
  // ═══════════════════════════════════════════════════════════

  async saveToSyncQueue(entity: string, action: string, payload: any) {
    this.logger.log(`📥 [OFFLINE-FIRST] Encolando ${action} de ${entity} en SQLite local...`);
    await this.prismaLocal.syncQueue.create({
      data: {
        entity,
        action,
        payload: JSON.stringify(payload),
      },
    });
    this.logger.log(`✅ Operación encolada localmente.`);
  }

  // ═══════════════════════════════════════════════════════════
  //  CRON: Intentar sincronizar cola local → Railway (cada minuto)
  // ═══════════════════════════════════════════════════════════

  @Cron(CronExpression.EVERY_MINUTE)
  async syncPendingOperations() {
    if (this.syncing) return;

    const pendingTasks = await this.prismaLocal.syncQueue.findMany({
      where: { synced: false },
      orderBy: { createdAt: 'asc' },
    });

    if (pendingTasks.length === 0) return;

    this.logger.log(`🔄 Intentando sincronizar ${pendingTasks.length} tareas pendientes → Railway...`);

    // Verificar conectividad
    try {
      await this.prismaCloud.$queryRaw`SELECT 1`;
    } catch {
      this.logger.warn(`🔴 Sin conexión a Railway. Sincronización pospuesta.`);
      return;
    }

    this.syncing = true;

    for (const task of pendingTasks) {
      try {
        const payload = JSON.parse(task.payload);
        await this.processCloudTask(task.entity, task.action, payload);

        await this.prismaLocal.syncQueue.update({
          where: { id: task.id },
          data: { synced: true, syncedAt: new Date() },
        });

        this.logger.log(`✅ [${task.action}] ${task.entity} (id=${task.id}) sincronizado a Railway.`);
      } catch (error) {
        this.logger.error(`❌ Error sincronizando tarea ${task.id} [${task.entity}]:`, error.message);
      }
    }

    this.syncing = false;
  }

  // ═══════════════════════════════════════════════════════════
  //  Router: procesar cada entidad hacia Railway (cloud)
  // ═══════════════════════════════════════════════════════════

  private async processCloudTask(entity: string, action: string, payload: any) {
    switch (entity) {
      case 'Lote':                return this.syncLoteCloud(action, payload);
      case 'CategoriaLote':       return this.syncCategoriaLoteCloud(action, payload);
      case 'SubparteLote':        return this.syncSubparteLoteCloud(action, payload);
      case 'LoteIndividual':      return this.syncLoteIndividualCloud(action, payload);
      case 'MovimientoInventario':return this.syncMovimientoCloud(action, payload);
      case 'CategoriaBase':       return this.syncCategoriaBaseCloud(action, payload);
      case 'SubparteBase':        return this.syncSubparteBaseCloud(action, payload);
      case 'ProductoBase':        return this.syncProductoBaseCloud(action, payload);
      case 'Proveedor':           return this.syncProveedorCloud(action, payload);
      case 'Procedencia':         return this.syncProcedenciaCloud(action, payload);
      case 'RegistroMerma':       return this.syncRegistroMermaCloud(action, payload);
      case 'ProductoSalida':      return this.syncProductoSalidaCloud(action, payload);
      case 'ProductoSalidaComponente': return this.syncProductoSalidaComponenteCloud(action, payload);
      case 'ProductoSalidaComponenteIndividual': return this.syncProductoSalidaComponenteIndividualCloud(action, payload);
      default:
        this.logger.warn(`⚠️ Entidad desconocida para sync: ${entity}`);
    }
  }

  private async syncLoteCloud(action: string, payload: any) {
    const { id, categoriasLote, subpartesLote, loteIndividual, alertasReglas, registroMerma, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.lote.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.lote.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.lote.delete({ where: { id } });
  }

  private async syncCategoriaLoteCloud(action: string, payload: any) {
    const { id, lote, categoriaBase, subpartes, alertasReglas, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.categoriaLote.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.categoriaLote.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.categoriaLote.delete({ where: { id } });
  }

  private async syncSubparteLoteCloud(action: string, payload: any) {
    const { id, lote, categoriaLote, subparteBase, movimientos, alertasReglas, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.subparteLote.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.subparteLote.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.subparteLote.delete({ where: { id } });
  }

  private async syncLoteIndividualCloud(action: string, payload: any) {
    const { lote, producto, procedencia, alertasReglas, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.loteIndividual.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.loteIndividual.update({ where: { idLote: data.idLote }, data });
    if (action === 'DELETE') return this.prismaCloud.loteIndividual.delete({ where: { idLote: data.idLote } });
  }

  private async syncMovimientoCloud(action: string, payload: any) {
    const { id, subparteLote, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.movimientoInventario.create({ data });
    if (action === 'DELETE') return this.prismaCloud.movimientoInventario.delete({ where: { id } });
  }

  private async syncCategoriaBaseCloud(action: string, payload: any) {
    const { id, subpartes, categoriasLote, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.categoriaBase.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.categoriaBase.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.categoriaBase.delete({ where: { id } });
  }

  private async syncSubparteBaseCloud(action: string, payload: any) {
    const { id, categoria, subpartesLote, productosSalidaComponentes, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.subparteBase.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.subparteBase.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.subparteBase.delete({ where: { id } });
  }

  private async syncProductoBaseCloud(action: string, payload: any) {
    const { id, lotesIndividuales, alertasReglas, productosSalidaComponentes, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.productoBase.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.productoBase.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.productoBase.delete({ where: { id } });
  }

  private async syncProveedorCloud(action: string, payload: any) {
    const { id, lotes, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.proveedor.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.proveedor.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.proveedor.delete({ where: { id } });
  }

  private async syncProcedenciaCloud(action: string, payload: any) {
    const { id, lotes, lotesIndividual, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.procedencia.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.procedencia.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.procedencia.delete({ where: { id } });
  }

  private async syncRegistroMermaCloud(action: string, payload: any) {
    const { id, lote, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.registroMerma.create({ data });
    if (action === 'UPDATE') return this.prismaCloud.registroMerma.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.registroMerma.delete({ where: { id } });
  }

  private async syncProductoSalidaCloud(action: string, payload: any) {
    const { id, componentes, componentesIndividual, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.productoSalida.create({ data: { id, ...data } });
    if (action === 'UPDATE') return this.prismaCloud.productoSalida.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.productoSalida.delete({ where: { id } });
  }

  private async syncProductoSalidaComponenteCloud(action: string, payload: any) {
    const { id, productoSalida, subparteBase, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.productoSalidaComponente.create({ data: { id, ...data } });
    if (action === 'UPDATE') return this.prismaCloud.productoSalidaComponente.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.productoSalidaComponente.delete({ where: { id } });
  }

  private async syncProductoSalidaComponenteIndividualCloud(action: string, payload: any) {
    const { id, productoSalida, productoBase, ...data } = payload;
    if (action === 'CREATE') return this.prismaCloud.productoSalidaComponenteIndividual.create({ data: { id, ...data } });
    if (action === 'UPDATE') return this.prismaCloud.productoSalidaComponenteIndividual.update({ where: { id }, data });
    if (action === 'DELETE') return this.prismaCloud.productoSalidaComponenteIndividual.delete({ where: { id } });
  }

  // ═══════════════════════════════════════════════════════════
  //  PULL: Railway → SQLite local (carga inicial / refresco)
  // ═══════════════════════════════════════════════════════════

  async pullRemoteChanges() {
    if (this.pullInProgress) {
      this.logger.warn('⚠️ Pull de Inventario ya está en progreso. Omitiendo...');
      return;
    }
    this.pullInProgress = true;
    this.pullError = null;
    this.logger.log('📥 Iniciando descarga completa de datos desde Railway (Inventario)...');
    try {
      // 1. CategoriaBase
      const categorias = await this.prismaCloud.categoriaBase.findMany();
      for (const cat of categorias) {
        await this.prismaLocal.categoriaBase.upsert({
          where: { id: cat.id },
          update: { tipoAnimal: cat.tipoAnimal, nombre: cat.nombre, estado: cat.estado },
          create: cat,
        });
      }
      this.logger.log(`⬇️ Pull: ${categorias.length} categorías base`);

      // 2. SubparteBase
      const subpartes = await this.prismaCloud.subparteBase.findMany();
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

      // 3. ProductoBase
      const bases = await this.prismaCloud.productoBase.findMany();
      for (const b of bases) {
        await this.prismaLocal.productoBase.upsert({
          where: { id: b.id },
          update: { nombre: b.nombre, categoria: b.categoria, estado: b.estado, reservaCombosKg: b.reservaCombosKg, consumidoCombosKg: b.consumidoCombosKg },
          create: b,
        });
      }
      this.logger.log(`⬇️ Pull: ${bases.length} productos base`);

      // 4. ProductoSalida
      const productosSalida = await this.prismaCloud.productoSalida.findMany();
      for (const prod of productosSalida) {
        await this.prismaLocal.productoSalida.upsert({
          where: { id: prod.id },
          update: { nombre: prod.nombre, unidad: prod.unidad, precio: prod.precio, etiqueta: prod.etiqueta, activo: prod.activo },
          create: prod,
        });
      }
      this.logger.log(`⬇️ Pull: ${productosSalida.length} productos de salida`);

      // 5. ProductoSalidaComponente
      const componentes = await this.prismaCloud.productoSalidaComponente.findMany();
      for (const comp of componentes) {
        await this.prismaLocal.productoSalidaComponente.upsert({
          where: {
            productoSalidaId_subparteBaseId: {
              productoSalidaId: comp.productoSalidaId,
              subparteBaseId: comp.subparteBaseId,
            },
          },
          update: { factorAsignacion: comp.factorAsignacion },
          create: {
            productoSalidaId: comp.productoSalidaId,
            subparteBaseId: comp.subparteBaseId,
            factorAsignacion: comp.factorAsignacion,
          },
        });
      }
      this.logger.log(`⬇️ Pull: ${componentes.length} componentes de productos`);

      // 6. ProductoSalidaComponenteIndividual
      const componentesInd = await this.prismaCloud.productoSalidaComponenteIndividual.findMany();
      for (const comp of componentesInd) {
        await this.prismaLocal.productoSalidaComponenteIndividual.upsert({
          where: {
            productoSalidaId_productoBaseId: {
              productoSalidaId: comp.productoSalidaId,
              productoBaseId: comp.productoBaseId,
            },
          },
          update: { factorAsignacion: comp.factorAsignacion },
          create: {
            productoSalidaId: comp.productoSalidaId,
            productoBaseId: comp.productoBaseId,
            factorAsignacion: comp.factorAsignacion,
          },
        });
      }
      this.logger.log(`⬇️ Pull: ${componentesInd.length} componentes individuales de productos`);

      // 7. Procedencia
      const procedencias = await this.prismaCloud.procedencia.findMany();
      for (const proc of procedencias) {
        await this.prismaLocal.procedencia.upsert({
          where: { id: proc.id },
          update: { nombre: proc.nombre },
          create: proc,
        });
      }
      this.logger.log(`⬇️ Pull: ${procedencias.length} procedencias`);

      // 8. Proveedor
      const proveedores = await this.prismaCloud.proveedor.findMany();
      for (const prov of proveedores) {
        await this.prismaLocal.proveedor.upsert({
          where: { id: prov.id },
          update: { nombre: prov.nombre, tipoAnimal: prov.tipoAnimal, telefono: prov.telefono, ciudad: prov.ciudad, tipoProveedor: prov.tipoProveedor, direccion: prov.direccion, cedulaNit: prov.cedulaNit, correo: prov.correo, observacion: prov.observacion },
          create: prov,
        });
      }
      this.logger.log(`⬇️ Pull: ${proveedores.length} proveedores`);

      // 9. Lote
      const lotes = await this.prismaCloud.lote.findMany();
      for (const l of lotes) {
        await this.prismaLocal.lote.upsert({
          where: { id: l.id },
          update: { tipoIngreso: l.tipoIngreso, tipoAnimal: l.tipoAnimal, procedenciaId: l.procedenciaId, guia: l.guia, fotoGuia: l.fotoGuia, pesoKgInicial: l.pesoKgInicial, pesoKgActual: l.pesoKgActual, pesoKgLimpio: l.pesoKgLimpio, pesoArrobaLimpio: l.pesoArrobaLimpio, precioKg: l.precioKg, precioArroba: l.precioArroba, precioTotal: l.precioTotal, limpio: l.limpio, sexo: l.sexo, clasificacion: l.clasificacion, dientes: l.dientes, despostado: l.despostado, fechaIngreso: l.fechaIngreso, idUsuario: l.idUsuario, proveedorId: l.proveedorId },
          create: l,
        });
      }
      this.logger.log(`⬇️ Pull: ${lotes.length} lotes`);

      // 10. CategoriaLote
      const catLotes = await this.prismaCloud.categoriaLote.findMany();
      for (const cl of catLotes) {
        await this.prismaLocal.categoriaLote.upsert({
          where: { id: cl.id },
          update: { idLote: cl.idLote, idCategoriaBase: cl.idCategoriaBase, pesoCategoriaKg: cl.pesoCategoriaKg, fechaRegistro: cl.fechaRegistro },
          create: cl,
        });
      }
      this.logger.log(`⬇️ Pull: ${catLotes.length} categorías de lotes`);

      // 11. SubparteLote
      const subLotes = await this.prismaCloud.subparteLote.findMany();
      for (const sl of subLotes) {
        await this.prismaLocal.subparteLote.upsert({
          where: { id: sl.id },
          update: { idLote: sl.idLote, idCategoriaLote: sl.idCategoriaLote, idSubparteBase: sl.idSubparteBase, pesoSubparteKg: sl.pesoSubparteKg, fechaPesado: sl.fechaPesado },
          create: sl,
        });
      }
      this.logger.log(`⬇️ Pull: ${subLotes.length} subpartes de lotes`);

      // 11. LoteIndividual
      const lotesIndiv = await this.prismaCloud.loteIndividual.findMany();
      for (const li of lotesIndiv) {
        await this.prismaLocal.loteIndividual.upsert({
          where: { idLote: li.idLote },
          update: { idProductoBase: li.idProductoBase, pesoKg: li.pesoKg, precioKg: li.precioKg, precioTotal: li.precioTotal, unidades: li.unidades, fechaRegistro: li.fechaRegistro, procedenciaId: li.procedenciaId },
          create: li,
        });
      }
      this.logger.log(`⬇️ Pull: ${lotesIndiv.length} lotes individuales`);

      this.pullCompleted = true;
      this.logger.log('✅ Pull completo desde Railway → SQLite (Inventario).');
    } catch (err) {
      this.pullError = err.message;
      this.logger.error('❌ Error durante el pull de inventario:', err.message);
    } finally {
      this.pullInProgress = false;
    }
  }
}
