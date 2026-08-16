import { Module } from '@nestjs/common';
import { LoteIndividualService } from './individualLote.service';
import { LoteIndividualController } from './individualLote.controller';
import { LoteIndividualRepository } from './repository/individualLote.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoteIndividualController],
  providers: [LoteIndividualService, LoteIndividualRepository],
  exports: [LoteIndividualService],
})
export class LoteIndividualModule {}
