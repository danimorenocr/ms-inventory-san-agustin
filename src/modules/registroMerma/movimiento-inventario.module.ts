import { Module } from '@nestjs/common';
import { MovimientoInventarioService } from './movimiento-inventario.service';
import { MovimientoInventarioController } from './movimiento-inventario.controller';
import { MovimientoInventarioRepository } from './repository/movimiento-inventario.repository';
import { PrismaModule } from '../../infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MovimientoInventarioController],
  providers: [MovimientoInventarioService, MovimientoInventarioRepository],
  exports: [MovimientoInventarioService],
})
export class MovimientoInventarioModule {}
