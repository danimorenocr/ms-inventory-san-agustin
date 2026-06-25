import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './infraestructure/prisma/prisma.module';
import { SyncModule } from './modules/sync/sync.module';
import { OfflineFilter } from './modules/sync/offline.filter';
import { CloudSyncInterceptor } from './modules/sync/sync.interceptor';
import { SyncMiddleware } from './modules/sync/sync.middleware';
import { CategoriesBaseModule } from './modules/categoriesBase/categories.module';
import { SubpartsModule } from './modules/subpartsBase/subparts.module';
import { ProductsModule } from './modules/productsBase/products.module';
import { ProductoSalidaModule } from './modules/productoSalida/producto-salida.module';
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
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesBaseModule,
    SubpartsModule,
    ProductsModule,
    ProductoSalidaModule,
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
    InventoryModule,
    SyncModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: OfflineFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CloudSyncInterceptor,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SyncMiddleware).forRoutes('*');
  }
}
