import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaLoteDto } from './dto/create-categorielote.dto';
import { UpdateCategoriaLoteDto } from './dto/update-categorielote.dto';
import { CategoriaLoteRepository } from './repository/categorielote.repository';

@Injectable()
export class CategoriaLoteService {
  constructor(private readonly repository: CategoriaLoteRepository) {}

  async create(createCategoriaLoteDto: CreateCategoriaLoteDto) {
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
    return this.repository.update(id, updateCategoriaLoteDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
