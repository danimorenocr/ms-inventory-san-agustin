import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { LoteRepository } from './repository/lote.repository';

@Injectable()
export class LoteService {
  constructor(private readonly repository: LoteRepository) {}

  async create(createLoteDto: CreateLoteDto) {
    return this.repository.create(createLoteDto);
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

  async update(id: number, updateLoteDto: UpdateLoteDto) {
    await this.findOne(id);
    return this.repository.update(id, updateLoteDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
