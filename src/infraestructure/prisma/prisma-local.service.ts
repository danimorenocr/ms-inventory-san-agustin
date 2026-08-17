import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as PrismaLocalClient } from '@prisma/client-local';

@Injectable()
export class PrismaLocalService extends PrismaLocalClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_LOCAL_URL,
        },
      },
    });

    const syncableModels = [
      'Lote',
      'CategoriaLote',
      'SubparteLote',
      'LoteIndividual',
      'MovimientoInventario',
      'CategoriaBase',
      'SubparteBase',
      'ProductoBase',
      'Proveedor',
      'Procedencia',
      'RegistroMerma',
      'ProductoSalida',
      'ProductoSalidaComponente',
      'ProductoSalidaComponenteIndividual'
    ].map(m => m.toLowerCase());

    (this as any).$use(async (params, next) => {
      const result = await next(params);

      const writeOperations = ['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany'];
      if (
        writeOperations.includes(params.action) &&
        params.model &&
        syncableModels.includes(params.model.toLowerCase())
      ) {
        try {
          let action = 'CREATE';
          if (params.action.startsWith('update')) action = 'UPDATE';
          if (params.action.startsWith('delete')) action = 'DELETE';

          let payload = result;
          if (params.action === 'delete' || params.action === 'deleteMany') {
            payload = result || params.args?.where;
          }

          if (params.action.endsWith('Many')) {
            if (params.action === 'createMany' && Array.isArray(params.args?.data)) {
              for (const item of params.args.data) {
                await this.syncQueue.create({
                  data: {
                    entity: params.model,
                    action: 'CREATE',
                    payload: JSON.stringify(item),
                  },
                });
              }
              return result;
            }
          }

          if (payload) {
            await this.syncQueue.create({
              data: {
                entity: params.model,
                action,
                payload: JSON.stringify(payload),
              },
            });
          }
        } catch (err) {
          console.error('❌ Error en el middleware de sincronización:', err);
        }
      }

      return result;
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
