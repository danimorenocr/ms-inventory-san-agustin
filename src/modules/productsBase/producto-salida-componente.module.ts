import { Module } from '@nestjs/common';
import { ProductoSalidaComponenteService } from './producto-salida-componente.service';
import { ProductoSalidaComponenteController } from './producto-salida-componente.controller';
import { ProductoSalidaComponenteRepository } from './repository/producto-salida-componente.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductoSalidaComponenteController],
  providers: [ProductoSalidaComponenteService, ProductoSalidaComponenteRepository],
  exports: [ProductoSalidaComponenteService],
})
export class ProductoSalidaComponenteModule {}
