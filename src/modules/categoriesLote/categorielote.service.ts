import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoriaLoteDto } from './dto/create-categorielote.dto';
import { UpdateCategoriaLoteDto } from './dto/update-categorielote.dto';
import { CategoriaLoteRepository } from './repository/categorielote.repository';
import { PrismaLocalService } from '../../infraestructure/prisma/prisma-local.service';

@Injectable()
export class CategoriaLoteService {
  constructor(
    private readonly repository: CategoriaLoteRepository,
    private readonly prisma: PrismaLocalService,
  ) {}

  async create(createCategoriaLoteDto: CreateCategoriaLoteDto) {
    // Verificar si ya existe la categoría en el lote
    const existing = await this.repository.findDuplicate(
      createCategoriaLoteDto.idLote,
      createCategoriaLoteDto.idCategoriaBase,
    );

    if (existing) {
      throw new ConflictException(
        `La categoría ya existe en el lote ${createCategoriaLoteDto.idLote}`,
      );
    }

    return this.repository.create(createCategoriaLoteDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const categoriaLote = await this.repository.findOne(id);
    if (!categoriaLote) {
      throw new NotFoundException(`Categoría de lote con ID ${id} no encontrada`);
    }
    return categoriaLote;
  }

  async findByLote(idLote: number) {
    return this.repository.findByLote(idLote);
  }

  async findByCategoriaBase(idCategoriaBase: number) {
    return this.repository.findByCategoriaBase(idCategoriaBase);
  }

  async update(id: number, updateCategoriaLoteDto: UpdateCategoriaLoteDto) {
    await this.findOne(id);
    const updated = await this.repository.update(id, updateCategoriaLoteDto);

    // Si el peso o unidades de la categoría se actualizaron, sincronizar con la subparte si es única (ej: Cerdo)
    if (updateCategoriaLoteDto.pesoCategoriaKg !== undefined || updateCategoriaLoteDto.unidades !== undefined) {
      const categoryData = await this.repository.findOne(id);
      const subpartes = categoryData?.subpartes || [];
      
      if (subpartes.length === 1) {
        const subparteUpdate: any = {};
        if (updateCategoriaLoteDto.pesoCategoriaKg !== undefined) {
          subparteUpdate.pesoSubparteKg = updateCategoriaLoteDto.pesoCategoriaKg;
        }
        if (updateCategoriaLoteDto.unidades !== undefined) {
          subparteUpdate.unidades = updateCategoriaLoteDto.unidades;
        }

        await this.prisma.subparteLote.update({
          where: { id: subpartes[0].id },
          data: subparteUpdate,
        });
        console.log(`🔄 Sincronizado subparte única de la categoría ${id}:`, subparteUpdate);
      }
    }

    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
