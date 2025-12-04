import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';

@Injectable()
export class LoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoteDto: CreateLoteDto) {
    return this.prisma.lote.create({
      data: createLoteDto,
    });
  }

  async findAll() {
    return this.prisma.lote.findMany({
      include: {
        proveedor: true,
        categoriasLote: {
          include: {
            categoriaBase: true,
          },
        },
        subpartesLote: {
          include: {
            subparteBase: true,
          },
        },
        loteIndividual: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fechaIngreso: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.lote.findUnique({
      where: { id },
      include: {
        proveedor: true,
        categoriasLote: {
          include: {
            categoriaBase: true,
            subpartes: {
              include: {
                subparteBase: true,
              },
            },
          },
        },
        subpartesLote: {
          include: {
            subparteBase: true,
            categoriaLote: true,
          },
        },
        loteIndividual: {
          include: {
            producto: true,
          },
        },
      },
    });
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.prisma.lote.findMany({
      where: { tipoAnimal },
      include: {
        proveedor: true,
        categoriasLote: {
          include: {
            categoriaBase: true,
          },
        },
        subpartesLote: {
          include: {
            subparteBase: true,
          },
        },
        loteIndividual: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fechaIngreso: 'desc',
      },
    });
  }

  async findByTipoIngreso(tipoIngreso: string) {
    return this.prisma.lote.findMany({
      where: { tipoIngreso },
      include: {
        proveedor: true,
        categoriasLote: {
          include: {
            categoriaBase: true,
          },
        },
        subpartesLote: {
          include: {
            subparteBase: true,
          },
        },
        loteIndividual: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fechaIngreso: 'desc',
      },
    });
  }

  async findByProveedorId(proveedorId: number) {
    return this.prisma.lote.findMany({
      where: { proveedorId },
      include: {
        proveedor: true,
        categoriasLote: {
          include: {
            categoriaBase: true,
          },
        },
        subpartesLote: {
          include: {
            subparteBase: true,
          },
        },
        loteIndividual: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        fechaIngreso: 'desc',
      },
    });
  }

  async update(id: number, updateLoteDto: UpdateLoteDto) {
    return this.prisma.lote.update({
      where: { id },
      data: updateLoteDto,
    });
  }

  async remove(id: number) {
    return this.prisma.lote.delete({
      where: { id },
    });
  }
}
