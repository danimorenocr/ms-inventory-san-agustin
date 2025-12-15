import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateProductoSalidaComponenteDto } from '../../productsBase/dto/create-producto-salida-componente.dto';
import { UpdateProductoSalidaComponenteDto } from '../../productsBase/dto/update-producto-salida-componente.dto';

@Injectable()
export class ProductoSalidaComponenteRepository {
  constructor(private prisma: PrismaService) {}

  async create(createProductoSalidaComponenteDto: CreateProductoSalidaComponenteDto) {
    return this.prisma.productoSalidaComponente.create({
      data: createProductoSalidaComponenteDto,
      include: {
        productoSalida: true,
      },
    });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.productoSalidaComponente.findMany({
      include: {
        productoSalida: true,
      },
      skip: skip || 0,
      take: take || 10,
    });
  }

  async findOne(id: number) {
    return this.prisma.productoSalidaComponente.findUnique({
      where: { id },
      include: {
        productoSalida: true,
      },
    });
  }

  async update(id: number, updateProductoSalidaComponenteDto: UpdateProductoSalidaComponenteDto) {
    return this.prisma.productoSalidaComponente.update({
      where: { id },
      data: updateProductoSalidaComponenteDto,
      include: {
        productoSalida: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.productoSalidaComponente.delete({
      where: { id },
    });
  }
}
