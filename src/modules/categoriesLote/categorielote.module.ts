import { Module } from '@nestjs/common';
import { CategoriaLoteService } from './categorielote.service';
import { CategoriaLoteController } from './categorielote.controller';
import { CategoriaLoteRepository } from './repository/categorielote.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriaLoteController],
  providers: [CategoriaLoteService, CategoriaLoteRepository],
  exports: [CategoriaLoteService],
})
export class CategoriaLoteModule {}
