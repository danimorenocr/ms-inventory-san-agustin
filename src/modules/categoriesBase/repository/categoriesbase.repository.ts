import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateCategoryBaseDto } from '../dto/create-category.dto';
import { UpdateCategoryBaseDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesBaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryBaseDto) {
    console.log('DTO recibido:', createCategoryDto);
    return this.prisma.categoriaBase.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.categoriaBase.findMany({
      where: { estado: true },
      include: {
        subpartes: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.categoriaBase.findUnique({
      where: { id },
      include: {
        subpartes: true,
      },
    });
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.prisma.categoriaBase.findMany({
      where: { 
        tipoAnimal,
        estado: true 
      },
      include: {
        subpartes: true,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryBaseDto) {
    return this.prisma.categoriaBase.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prisma.categoriaBase.update({
      where: { id },
      data: { estado: false },
    });
  }

  async hardDelete(id: number) {
    return this.prisma.categoriaBase.delete({
      where: { id },
    });
  }
}
