import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaLocalService } from './prisma-local.service';

@Global()
@Module({
  providers: [PrismaService, PrismaLocalService],
  exports: [PrismaService, PrismaLocalService],
})
export class PrismaModule {}
