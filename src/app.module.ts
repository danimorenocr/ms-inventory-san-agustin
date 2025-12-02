import { Module } from '@nestjs/common';
import { PrismaModule } from './infraestructure/prisma/prisma.module';
import { CategoriesBaseModule } from './modules/categoriesBase/categories.module';
import { SubpartsModule } from './modules/subpartsBase/subparts.module';
import { ProductsModule } from './modules/productsBase/products.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesBaseModule,
    SubpartsModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
