import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubparteLoteDto } from './dto/create-subpartLote.dto';
import { UpdateSubparteLoteDto } from './dto/update-subpartLote.dto';
import { SubparteLoteRepository } from './repository/subpartsLote.repository';

@Injectable()
export class SubparteLoteService {
  constructor(private readonly repository: SubparteLoteRepository) {}

  async create(createSubparteLoteDto: CreateSubparteLoteDto) {
    return this.repository.create(createSubparteLoteDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const subparteLote = await this.repository.findOne(id);
    if (!subparteLote) {
      throw new NotFoundException(`Subparte de lote con ID ${id} no encontrada`);
    }
    return subparteLote;
  }

  async findByLote(idLote: number) {
    return this.repository.findByLote(idLote);
  }

  async findByCategoriaLote(idCategoriaLote: number) {
    return this.repository.findByCategoriaLote(idCategoriaLote);
  }

  async findBySubparteBase(idSubparteBase: number) {
    return this.repository.findBySubparteBase(idSubparteBase);
  }

  async update(id: number, updateSubparteLoteDto: UpdateSubparteLoteDto) {
    await this.findOne(id);
    return this.repository.update(id, updateSubparteLoteDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
