import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient as PrismaCloudClient } from '@prisma/client-cloud';

@Injectable()
export class PrismaCloudService extends PrismaCloudClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaCloudService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('☁️ Conectado a la base de datos en la nube.');
    } catch (error) {
      this.logger.warn('⚠️ No se pudo conectar a la base de datos en la nube. Sincronización pausada.');
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
