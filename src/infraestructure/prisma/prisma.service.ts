import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';
import { PrismaCloudService } from './prisma-cloud.service';

export const syncContext = new AsyncLocalStorage<{ useCloud: boolean }>();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(forwardRef(() => PrismaCloudService)) private cloudService: PrismaCloudService) {
    super();
    
    return new Proxy(this, {
      get: (target, prop) => {
        const store = syncContext.getStore();
        require('fs').appendFileSync('proxy.log', `[PrismaProxy] prop: ${String(prop)}, store: ${JSON.stringify(store)}\n`);
        if (store?.useCloud && typeof prop === 'string' && prop !== '$connect' && prop !== '$disconnect' && prop !== 'onModuleInit' && prop !== 'onModuleDestroy') {
          require('fs').appendFileSync('proxy.log', `[PrismaProxy] Returning cloudProp for ${prop}\n`);
          const cloudProp = (this.cloudService as any)[prop];
          if (cloudProp) {
            return cloudProp;
          }
        }
        return (target as any)[prop];
      }
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('💾 Conectado a la base de datos LOCAL (Primaria).');
    } catch (error) {
      this.logger.error('Failed to connect to primary database. Proceeding in offline mode.', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
