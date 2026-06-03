import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';
import { PrismaLocalService } from '../../infraestructure/prisma/prisma-local.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService, // Remote Postgres
    private readonly prismaLocal: PrismaLocalService, // Local SQLite
  ) {}

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
}
