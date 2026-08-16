import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreatesubpartDto } from '../dto/create-subpart.dto';
import { UpdatesubpartDto } from '../dto/update-subpart.dto';

@Injectable()
export class SubpartsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createSubpartDto: CreatesubpartDto) {
    return this.prisma.subparteBase.create({
      data: createSubpartDto,
    });
  }

  async findAll() {
    return this.prisma.subparteBase.findMany({
      where: { estado: true },
      include: {
        categoria: true,
        subpartesLote: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.subparteBase.findUnique({
      where: { id },
      include: {
        categoria: true,
        subpartesLote: true,
      },
    });
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.prisma.subparteBase.findMany({
      where: {
        estado: true,
        categoria: {
          is: {
            tipoAnimal,
            estado: true,
          },
        },
      },
      include: {
        categoria: true,
        subpartesLote: true,
      },
    });
  }

  async findByIds(ids: number[]) {
    return this.prisma.subparteBase.findMany({
      where: {
        id: { in: ids },
        estado: true,
      },
      select: {
        id: true,
        nombre: true,
      },
    });
  }

  async update(id: number, updateSubpartDto: UpdatesubpartDto) {
    return this.prisma.subparteBase.update({
      where: { id },
      data: updateSubpartDto,
    });
  }

  async remove(id: number) {
    return this.prisma.subparteBase.update({
      where: { id },
      data: { estado: false },
    });
  }

  async hardDelete(id: number) {
    return this.prisma.subparteBase.delete({
      where: { id },
    });
  }
}
