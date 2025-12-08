import { Module } from '@nestjs/common';
import { PrismaModule } from './infraestructure/prisma/prisma.module';
import { CategoriesBaseModule } from './modules/categoriesBase/categories.module';
import { SubpartsModule } from './modules/subpartsBase/subparts.module';
import { ProductsModule } from './modules/productsBase/products.module';
import { LoteModule } from './modules/lote/lote.module';
import { CategoriaLoteModule } from './modules/categoriesLote/categorielote.module';
import { SubparteLoteModule } from './modules/subpartsLote/subpartsLote.module';
import { LoteIndividualModule } from './modules/individualLote/individualLote.module';
import { ProviderModule } from './modules/providers/provider.module';
import { AlertModule } from './modules/alerts/alert.module';
import { ProvenanceModule } from './modules/provenance/provenance.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesBaseModule,
    SubpartsModule,
    ProductsModule,
    LoteModule,
    CategoriaLoteModule,
    SubparteLoteModule,
    LoteIndividualModule,
    ProviderModule,
    AlertModule,
    ProvenanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
