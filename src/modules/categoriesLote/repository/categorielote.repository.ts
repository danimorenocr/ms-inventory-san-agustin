import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateCategoriaLoteDto } from '../dto/create-categorielote.dto';
import { UpdateCategoriaLoteDto } from '../dto/update-categorielote.dto';

@Injectable()
export class CategoriaLoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoriaLoteDto: CreateCategoriaLoteDto) {
    return this.prisma.categoriaLote.create({
      data: createCategoriaLoteDto,
    });
  }

  async findAll() {
    return this.prisma.categoriaLote.findMany({
      include: {
        lote: true,
        categoriaBase: true,
        subpartes: {
          include: {
            subparteBase: true,
          },
        },
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.categoriaLote.findUnique({
      where: { id },
      include: {
        lote: true,
        categoriaBase: true,
        subpartes: {
          include: {
            subparteBase: true,
          },
        },
      },
    });
  }

  async findByLote(idLote: number) {
    return this.prisma.categoriaLote.findMany({
      where: { idLote },
      include: {
        categoriaBase: true,
        subpartes: {
          include: {
            subparteBase: true,
          },
        },
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });
  }

  async findByCategoriaBase(idCategoriaBase: number) {
    return this.prisma.categoriaLote.findMany({
      where: { idCategoriaBase },
      include: {
        lote: true,
        subpartes: {
          include: {
            subparteBase: true,
          },
        },
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });
  }

  async findDuplicate(idLote: number, idCategoriaBase: number) {
    return this.prisma.categoriaLote.findFirst({
      where: {
        idLote,
        idCategoriaBase,
      },
    });
  }

  async update(id: number, updateCategoriaLoteDto: UpdateCategoriaLoteDto) {
    return this.prisma.categoriaLote.update({
      where: { id },
      data: updateCategoriaLoteDto,
    });
  }

  async remove(id: number) {
    return this.prisma.categoriaLote.delete({
      where: { id },
    });
  }
}
