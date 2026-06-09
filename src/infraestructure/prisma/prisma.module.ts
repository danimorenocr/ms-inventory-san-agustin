import { Module, Global, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaLocalService } from './prisma-local.service';

const service: any = PrismaService;
const localService: any = PrismaLocalService;
const providers = [service, localService];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class PrismaModule {}
