import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { LoteRepository } from './repository/lote.repository';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';

@Injectable()
export class LoteService {
  constructor(
    private readonly repository: LoteRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createLoteDto: CreateLoteDto) {
    // Crear el lote
    const lote = await this.repository.create(createLoteDto);

    // Obtener las categorías base según el tipo de animal
    const categoriasBase = await this.prisma.categoriaBase.findMany({
      where: {
        tipoAnimal: createLoteDto.tipoAnimal,
        estado: true,
      },
      include: {
        subpartes: {
          where: { estado: true },
        },
      },
    });

    // Crear categorías de lote con peso inicial en 0
    for (const categoriaBase of categoriasBase) {
      const categoriaLote = await this.prisma.categoriaLote.create({
        data: {
          idLote: lote.id,
          idCategoriaBase: categoriaBase.id,
          pesoCategoriaKg: 0,
        },
      });

      // Crear subpartes de lote para cada subparte base con peso inicial en 0
      for (const subparteBase of categoriaBase.subpartes) {
        await this.prisma.subparteLote.create({
          data: {
            idLote: lote.id,
            idCategoriaLote: categoriaLote.id,
            idSubparteBase: subparteBase.id,
            pesoSubparteKg: 0,
          },
        });
      }
    }

    // Retornar el lote con sus relaciones
    return this.findOne(lote.id);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const lote = await this.repository.findOne(id);
    if (!lote) {
      throw new NotFoundException(`Lote con ID ${id} no encontrado`);
    }
    return lote;
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.repository.findByTipoAnimal(tipoAnimal);
  }

  async findByTipoIngreso(tipoIngreso: string) {
    return this.repository.findByTipoIngreso(tipoIngreso);
  }

  async findByProveedorId(proveedorId: number) {
    return this.repository.findByProveedorId(proveedorId);
  }

  async update(id: number, updateLoteDto: UpdateLoteDto) {
    await this.findOne(id);
    return this.repository.update(id, updateLoteDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
