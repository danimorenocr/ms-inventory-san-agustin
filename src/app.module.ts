import { Module } from '@nestjs/common';
import { PrismaModule } from './infraestructure/prisma/prisma.module';
import { CategoriesBaseModule } from './modules/categoriesBase/categories.module';
import { SubpartsModule } from './modules/subpartsBase/subparts.module';
import { ProductsModule } from './modules/productsBase/products.module';
import { ProductoSalidaModule } from './modules/productsBase/producto-salida.module';
import { ProductoSalidaComponenteModule } from './modules/productsBase/producto-salida-componente.module';
import { LoteModule } from './modules/lote/lote.module';
import { CategoriaLoteModule } from './modules/categoriesLote/categorielote.module';
import { SubparteLoteModule } from './modules/subpartsLote/subpartsLote.module';
import { LoteIndividualModule } from './modules/individualLote/individualLote.module';
import { ProviderModule } from './modules/providers/provider.module';
import { AlertModule } from './modules/alerts/alert.module';
import { AlertaReglaModule } from './modules/alertaRegla/alerta-regla.module';
import { RegistroMermaModule } from './modules/registroMerma/registro-merma.module';
import { MovimientoInventarioModule } from './modules/registroMerma/movimiento-inventario.module';
import { ProvenanceModule } from './modules/provenance/provenance.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    PrismaModule,
    CategoriesBaseModule,
    SubpartsModule,
    ProductsModule,
    ProductoSalidaModule,
    ProductoSalidaComponenteModule,
    LoteModule,
    CategoriaLoteModule,
    SubparteLoteModule,
    LoteIndividualModule,
    ProviderModule,
    AlertModule,
    AlertaReglaModule,
    RegistroMermaModule,
    MovimientoInventarioModule,
    ProvenanceModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

