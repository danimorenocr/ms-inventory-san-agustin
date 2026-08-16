import { Module } from '@nestjs/common';
import { CategoriesBaseService } from './categories.service';
import { CategoriesBaseController } from './categories.controller';
import { CategoriesBaseRepository } from './repository/categoriesbase.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesBaseController],
  providers: [CategoriesBaseService, CategoriesBaseRepository],
  exports: [CategoriesBaseService],
})
export class CategoriesBaseModule {}
