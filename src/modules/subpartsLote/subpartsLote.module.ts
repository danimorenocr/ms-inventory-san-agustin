import { Module } from '@nestjs/common';
import { SubparteLoteService } from './subpartsLote.service';
import { SubparteLoteController } from './subpartsLote.controller';
import { SubparteLoteRepository } from './repository/subpartsLote.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubparteLoteController],
  providers: [SubparteLoteService, SubparteLoteRepository],
  exports: [SubparteLoteService],
})
export class SubparteLoteModule {}
