import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryBaseDto } from './dto/create-category.dto';
import { UpdateCategoryBaseDto } from './dto/update-category.dto';
import { CategoriesBaseRepository } from './repository/categoriesbase.repository';

@Injectable()
export class CategoriesBaseService {
  constructor(private readonly repository: CategoriesBaseRepository) {}

  async create(createCategoryDto: CreateCategoryBaseDto) {
    return this.repository.create(createCategoryDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const category = await this.repository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.repository.findByTipoAnimal(tipoAnimal);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryBaseDto) {
    await this.findOne(id);
    return this.repository.update(id, updateCategoryDto);
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
