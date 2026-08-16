import { Module } from '@nestjs/common';
import { RegistroMermaService } from './registro-merma.service';
import { RegistroMermaController } from './registro-merma.controller';
import { RegistroMermaRepository } from './repository/registro-merma.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RegistroMermaController],
  providers: [RegistroMermaService, RegistroMermaRepository],
  exports: [RegistroMermaService],
})
export class RegistroMermaModule {}
