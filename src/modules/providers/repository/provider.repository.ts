import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { UpdateProviderDto } from '../dto/update-provider.dto';

@Injectable()
export class ProviderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProviderDto: CreateProviderDto) {
    return this.prisma.proveedor.create({
      data: createProviderDto,
    });
  }

  async findAll() {
    return this.prisma.proveedor.findMany({
      include: {
        lotes: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.proveedor.findUnique({
      where: { id },
      include: {
        lotes: true,
      },
    });
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.prisma.proveedor.findMany({
      where: { tipoAnimal },
      include: {
        lotes: true,
      },
    });
  }

  async findByTipoProveedor(tipoProveedor: string) {
    return this.prisma.proveedor.findMany({
      where: { tipoProveedor },
      include: {
        lotes: true,
      },
    });
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    return this.prisma.proveedor.update({
      where: { id },
      data: updateProviderDto,
    });
  }

  async remove(id: number) {
    return this.prisma.proveedor.delete({
      where: { id },
    });
  }
}
