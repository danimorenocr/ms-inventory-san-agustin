import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AlertRepository } from './repository/alert.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlertController],
  providers: [AlertService, AlertRepository],
  exports: [AlertService],
})
export class AlertModule {}
