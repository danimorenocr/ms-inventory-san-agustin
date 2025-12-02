import { Module } from '@nestjs/common';
import { PrismaModule } from './infraestructure/prisma/prisma.module';
import { CategoriesBaseModule } from './modules/categoriesBase/categories.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesBaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
