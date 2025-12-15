import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateMovimientoInventarioDto } from '../dto/create-movimiento-inventario.dto';
import { UpdateMovimientoInventarioDto } from '../dto/update-movimiento-inventario.dto';

@Injectable()
export class MovimientoInventarioRepository {
  constructor(private prisma: PrismaService) {}

  async create(createMovimientoInventarioDto: CreateMovimientoInventarioDto) {
    return this.prisma.movimientoInventario.create({
      data: createMovimientoInventarioDto,
    });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.movimientoInventario.findMany({
      skip: skip || 0,
      take: take || 10,
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.movimientoInventario.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateMovimientoInventarioDto: UpdateMovimientoInventarioDto) {
    return this.prisma.movimientoInventario.update({
      where: { id },
      data: updateMovimientoInventarioDto,
    });
  }

  async remove(id: number) {
    return this.prisma.movimientoInventario.delete({
      where: { id },
    });
  }
}
