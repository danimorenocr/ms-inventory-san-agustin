import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoSalidaComponenteDto } from '../productsBase/dto/create-producto-salida-componente.dto';
import { UpdateProductoSalidaComponenteDto } from '../productsBase/dto/update-producto-salida-componente.dto';
import { ProductoSalidaComponenteRepository } from '../productsBase/repository/producto-salida-componente.repository';

@Injectable()
export class ProductoSalidaComponenteService {
  constructor(
    private readonly repository: ProductoSalidaComponenteRepository,
  ) {}

  async create(createProductoSalidaComponenteDto: CreateProductoSalidaComponenteDto) {
    return this.repository.create(createProductoSalidaComponenteDto);
  }

  async findAll(skip?: number, take?: number) {
    return this.repository.findAll(skip, take);
  }

  async findOne(id: number) {
    const componente = await this.repository.findOne(id);
    if (!componente) {
      throw new NotFoundException(`Componente con ID ${id} no encontrado`);
    }
    return componente;
  }

  async update(id: number, updateProductoSalidaComponenteDto: UpdateProductoSalidaComponenteDto) {
    const componente = await this.repository.findOne(id);
    if (!componente) {
      throw new NotFoundException(`Componente con ID ${id} no encontrado`);
    }
    return this.repository.update(id, updateProductoSalidaComponenteDto);
  }

  async remove(id: number) {
    const componente = await this.repository.findOne(id);
    if (!componente) {
      throw new NotFoundException(`Componente con ID ${id} no encontrado`);
    }
    return this.repository.remove(id);
  }
}
