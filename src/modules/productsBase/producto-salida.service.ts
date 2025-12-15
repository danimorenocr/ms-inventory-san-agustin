import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoSalidaDto } from './dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from './dto/update-producto-salida.dto';
import { ProductoSalidaRepository } from './repository/producto-salida.repository';

@Injectable()
export class ProductoSalidaService {
  constructor(private readonly repository: ProductoSalidaRepository) {}

  async create(createProductoSalidaDto: CreateProductoSalidaDto) {
    return this.repository.create(createProductoSalidaDto);
  }

  async findAll(skip?: number, take?: number) {
    return this.repository.findAll(skip, take);
  }

  async findOne(id: number) {
    const producto = await this.repository.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto de salida con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoSalidaDto: UpdateProductoSalidaDto) {
    const producto = await this.repository.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto de salida con ID ${id} no encontrado`);
    }
    return this.repository.update(id, updateProductoSalidaDto);
  }

  async remove(id: number) {
    const producto = await this.repository.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto de salida con ID ${id} no encontrado`);
    }
    return this.repository.remove(id);
  }
}
