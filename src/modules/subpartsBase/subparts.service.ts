import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatesubpartDto } from './dto/create-subpart.dto';
import { UpdatesubpartDto } from './dto/update-subpart.dto';
import { SubpartsRepository } from './repository/subparts.repository';

@Injectable()
export class SubpartsService {
  constructor(private readonly repository: SubpartsRepository) { }

  async create(createSubpartDto: CreatesubpartDto) {
    return this.repository.create(createSubpartDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const subpart = await this.repository.findOne(id);
    if (!subpart) {
      throw new NotFoundException(`Subparte con ID ${id} no encontrada`);
    }
    return subpart;
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.repository.findByTipoAnimal(tipoAnimal);
  }

  async findByIds(ids: number[]) {
    return this.repository.findByIds(ids);
  }

  async update(id: number, updateSubpartDto: UpdatesubpartDto) {
    await this.findOne(id);
    return this.repository.update(id, updateSubpartDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async hardDelete(id: number) {
    await this.findOne(id);
    return this.repository.hardDelete(id);
  }
}
