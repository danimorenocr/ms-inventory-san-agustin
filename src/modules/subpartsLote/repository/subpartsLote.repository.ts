import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateSubparteLoteDto } from '../dto/create-subpartLote.dto';
import { UpdateSubparteLoteDto } from '../dto/update-subpartLote.dto';

@Injectable()
export class SubparteLoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubparteLoteDto: CreateSubparteLoteDto) {
    return this.prisma.subparteLote.create({
      data: createSubparteLoteDto,
    });
  }

  async findAll() {
    return this.prisma.subparteLote.findMany({
      include: {
        lote: true,
        categoriaLote: {
          include: {
            categoriaBase: true,
          },
        },
        subparteBase: true,
      },
      orderBy: {
        fechaPesado: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.subparteLote.findUnique({
      where: { id },
      include: {
        lote: true,
        categoriaLote: {
          include: {
            categoriaBase: true,
          },
        },
        subparteBase: true,
      },
    });
  }

  async findByLote(idLote: number) {
    return this.prisma.subparteLote.findMany({
      where: { idLote },
      include: {
        categoriaLote: {
          include: {
            categoriaBase: true,
          },
        },
        subparteBase: true,
      },
      orderBy: {
        fechaPesado: 'desc',
      },
    });
  }

  async findByCategoriaLote(idCategoriaLote: number) {
    return this.prisma.subparteLote.findMany({
      where: { idCategoriaLote },
      include: {
        lote: true,
        subparteBase: true,
      },
      orderBy: {
        fechaPesado: 'desc',
      },
    });
  }

  async findBySubparteBase(idSubparteBase: number) {
    return this.prisma.subparteLote.findMany({
      where: { idSubparteBase },
      include: {
        lote: true,
        categoriaLote: {
          include: {
            categoriaBase: true,
          },
        },
      },
      orderBy: {
        fechaPesado: 'desc',
      },
    });
  }

  async update(id: number, updateSubparteLoteDto: UpdateSubparteLoteDto) {
    return this.prisma.subparteLote.update({
      where: { id },
      data: updateSubparteLoteDto,
    });
  }

  async remove(id: number) {
    return this.prisma.subparteLote.delete({
      where: { id },
    });
  }
}
