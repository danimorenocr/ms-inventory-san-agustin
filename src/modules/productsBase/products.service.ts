import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repository/products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    return this.repository.create(createProductDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const product = await this.repository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async findByCategoria(categoria: string) {
    return this.repository.findByCategoria(categoria);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.repository.update(id, updateProductDto);
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
