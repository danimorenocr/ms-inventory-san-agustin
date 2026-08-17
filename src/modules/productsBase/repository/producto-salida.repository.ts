import { Injectable } from '@nestjs/common';
import { PrismaLocalService } from '../../../infraestructure/prisma/prisma-local.service';
import { CreateProductoSalidaDto } from '../dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from '../dto/update-producto-salida.dto';

@Injectable()
export class ProductoSalidaRepository {
  constructor(private prisma: PrismaLocalService) { }

  async create(createProductoSalidaDto: CreateProductoSalidaDto) {
    return this.prisma.productoSalida.create({
      data: createProductoSalidaDto,
      include: {
        componentes: true,
      },
    });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.productoSalida.findMany({
      where: {
        activo: true,
      },
      include: {
        componentes: {
          include: {
            subparteBase: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
      skip: skip || 0,
      take: take || 100,
    });
  }

  async findOne(id: number) {
    return this.prisma.productoSalida.findUnique({
      where: { id },
      include: {
        componentes: {
          include: {
            subparteBase: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateProductoSalidaDto: UpdateProductoSalidaDto) {
    return this.prisma.productoSalida.update({
      where: { id },
      data: updateProductoSalidaDto,
      include: {
        componentes: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.productoSalida.delete({
      where: { id },
    });
  }
}
