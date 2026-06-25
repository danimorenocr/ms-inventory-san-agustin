import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaCloudService } from './prisma-cloud.service';

@Global()
@Module({
  providers: [PrismaService, PrismaCloudService],
  exports: [PrismaService, PrismaCloudService],
})
export class PrismaModule {}
