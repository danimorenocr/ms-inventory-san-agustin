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

    const rawClient = this;

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

    const extendedClient = rawClient.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const result = await query(args);

            const writeOperations = ['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany'];
            if (
              writeOperations.includes(operation) &&
              syncableModels.includes(model.toLowerCase())
            ) {
              try {
                let action = 'CREATE';
                if (operation.startsWith('update')) action = 'UPDATE';
                if (operation.startsWith('delete')) action = 'DELETE';

                let payload = result;
                if (operation === 'delete' || operation === 'deleteMany') {
                  payload = result || args?.where;
                }

                if (operation.endsWith('Many')) {
                  if (operation === 'createMany' && Array.isArray(args?.data)) {
                    for (const item of args.data) {
                      await rawClient.syncQueue.create({
                        data: {
                          entity: model,
                          action: 'CREATE',
                          payload: JSON.stringify(item),
                        },
                      });
                    }
                    return result;
                  }
                }

                if (payload) {
                  await rawClient.syncQueue.create({
                    data: {
                      entity: model,
                      action,
                      payload: JSON.stringify(payload),
                    },
                  });
                }
              } catch (err) {
                console.error('❌ Error en la extensión de sincronización:', err);
              }
            }

            return result;
          }
        }
      }
    });

    // Inyectar dinámicamente los NestJS hooks en el cliente extendido
    (extendedClient as any).onModuleInit = async () => {
      await rawClient.$connect();
    };

    (extendedClient as any).onModuleDestroy = async () => {
      await rawClient.$disconnect();
    };

    return extendedClient as any;
  }

  // Métodos requeridos por la interfaz OnModuleInit y OnModuleDestroy de TypeScript
  async onModuleInit() {}
  async onModuleDestroy() {}
}

