import { Module } from '@nestjs/common';
import { ProductoSalidaService } from './producto-salida.service';
import { ProductoSalidaController } from './producto-salida.controller';
import { ProductoSalidaRepository } from './repository/producto-salida.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductoSalidaController],
  providers: [ProductoSalidaService, ProductoSalidaRepository],
  exports: [ProductoSalidaService],
})
export class ProductoSalidaModule {}
