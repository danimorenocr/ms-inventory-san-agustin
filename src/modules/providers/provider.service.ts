import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderRepository } from './repository/provider.repository';

@Injectable()
export class ProviderService {
  constructor(private readonly repository: ProviderRepository) {}

  async create(createProviderDto: CreateProviderDto) {
    return this.repository.create(createProviderDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const provider = await this.repository.findOne(id);
    if (!provider) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return provider;
  }

  async findByTipoAnimal(tipoAnimal: string) {
    return this.repository.findByTipoAnimal(tipoAnimal);
  }

  async findByTipoProveedor(tipoProveedor: string) {
    return this.repository.findByTipoProveedor(tipoProveedor);
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    await this.findOne(id);
    return this.repository.update(id, updateProviderDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
