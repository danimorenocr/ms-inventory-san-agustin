import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';
import { PrismaCloudService } from '../../infraestructure/prisma/prisma-cloud.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService, // Remote Postgres
    private readonly prismaCloud: PrismaCloudService, // Cloud Postgres
  ) {}

  /**
   * Guarda una operación en la base de datos local cuando no hay internet
   */
  async saveToSyncQueue(entity: string, action: string, payload: any) {
    this.logger.warn(`No hay internet. Guardando operación de ${entity} en la cola local (SQLite)...`);
    
    await this.prisma.syncQueue.create({
      data: {
        entity,
        action,
        payload: JSON.stringify(payload),
      },
    });
    
    this.logger.log(`Operación guardada exitosamente en modo offline.`);
  }

  /**
   * CronJob que se ejecuta cada 10 segundos para intentar sincronizar
   * los datos de las tablas locales hacia la nube (Postgres)
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
      // Comprobar si hay internet haciendo un query rápido a Postgres en la nube
      try {
        await this.prismaCloud.$queryRaw`SELECT 1`;
      } catch (error) {
        this.logger.warn(`❌ Sin conexión a internet (Railway). Sincronización pospuesta.`);
        return;
      }

      this.logger.log('🔄 Iniciando sincronización DIRECTA a la nube...');

      const tablesToSync = [
        'categoriaBase',
        'productoBase',
        'procedencia',
        'proveedor',
        'subparteBase',
        'productoSalida',
        'lote',
        'categoriaLote',
        'loteIndividual',
        'subparteLote',
        'movimientoInventario',
        'registroMerma',
        'alerta',
        'alertaRegla'
      ];

      for (const table of tablesToSync) {
        try {
          // Obtener todos los registros locales
          const localRecords = await (this.prisma as any)[table].findMany();
          
          if (localRecords && localRecords.length > 0) {
            // Si la tabla no tiene un 'id' simple (ej. llaves compuestas), lo subimos directo
            if (localRecords[0].id === undefined) {
              const result = await (this.prismaCloud as any)[table].createMany({
                data: localRecords,
                skipDuplicates: true,
              });
              if (result.count > 0) {
                this.logger.log(`✅ Sincronizados ${result.count} registros nuevos en la tabla ${table}`);
              }
              continue; // Saltamos a la siguiente tabla
            }

            // 1. Obtener los IDs locales
            const localIds = localRecords.map(r => r.id);

            // 2. Consultar qué IDs ya existen en la Nube
            const existingInCloud = await (this.prismaCloud as any)[table].findMany({
              where: { id: { in: localIds } },
              select: { id: true }
            });
            
            const existingIds = new Set(existingInCloud.map(r => r.id));

            // 3. Filtrar para quedarse solo con los registros NUEVOS
            const recordsToSync = localRecords.filter(r => !existingIds.has(r.id));

            if (recordsToSync.length > 0) {
              // 4. Sincronizar solo los nuevos
              const result = await (this.prismaCloud as any)[table].createMany({
                data: recordsToSync,
                skipDuplicates: true,
              });
              if (result.count > 0) {
                this.logger.log(`✅ Sincronizados ${result.count} registros nuevos en la tabla ${table}`);
              }
            }
          }
        } catch (error) {
          this.logger.error(`❌ Error sincronizando tabla ${table}: ${error.message}`);
        }
      }

      this.logger.log('✅ Sincronización DIRECTA finalizada.');
    } catch (error) {
      this.logger.error(`❌ Error general en sincronización DIRECTA: ${error.message}`);
    }
  }
}
