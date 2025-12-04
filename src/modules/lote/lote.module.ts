import { Module } from '@nestjs/common';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { LoteRepository } from './repository/lote.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';
import { CategoriesBaseModule } from '../categoriesBase/categories.module';
import { ProviderModule } from '../providers/provider.module';

@Module({
  imports: [PrismaModule, CategoriesBaseModule, ProviderModule],
  controllers: [LoteController],
  providers: [LoteService, LoteRepository],
  exports: [LoteService],
})
export class LoteModule {}
