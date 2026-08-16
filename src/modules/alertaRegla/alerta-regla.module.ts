import { Module } from '@nestjs/common';
import { AlertaReglaService } from './alerta-regla.service';
import { AlertaReglaController } from './alerta-regla.controller';
import { AlertaReglaRepository } from './repository/alerta-regla.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlertaReglaController],
  providers: [AlertaReglaService, AlertaReglaRepository],
  exports: [AlertaReglaService],
})
export class AlertaReglaModule {}
