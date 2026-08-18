import { Injectable } from '@nestjs/common';
import { PrismaLocalService } from '../../../infraestructure/prisma/prisma-local.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaLocalService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.productoBase.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.productoBase.findMany({
      where: { estado: true },
      include: {
        lotesIndividuales: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.productoBase.findUnique({
      where: { id },
      include: {
        lotesIndividuales: true,
      },
    });
  }

  async findByCategoria(categoria: string) {
    return this.prisma.productoBase.findMany({
      where: {
        categoria: categoria.toLowerCase(),
        estado: true,
      },
      include: {
        lotesIndividuales: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.productoBase.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return this.prisma.productoBase.update({
      where: { id },
      data: { estado: false },
    });
  }

  async hardDelete(id: number) {
    return this.prisma.productoBase.delete({
      where: { id },
    });
  }
}
