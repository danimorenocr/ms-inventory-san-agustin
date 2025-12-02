import { Module } from '@nestjs/common';
import { PrismaModule } from './infraestructure/prisma/prisma.module';
import { CategoriesBaseModule } from './modules/categoriesBase/categories.module';
import { SubpartsModule } from './modules/subpartsBase/subparts.module';
import { ProductsModule } from './modules/productsBase/products.module';
import { LoteModule } from './modules/lote/lote.module';
import { CategoriaLoteModule } from './modules/categoriesLote/categorielote.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesBaseModule,
    SubpartsModule,
    ProductsModule,
    LoteModule,
    CategoriaLoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
