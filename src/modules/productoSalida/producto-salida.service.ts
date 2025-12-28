import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductoSalidaRepository } from './repository/producto-salida.repository';
import { CreateProductoSalidaDto } from './dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from './dto/update-producto-salida.dto';
import { AddComponenteSubparteDto } from './dto/add-componente-subparte.dto';
import { AddComponenteLoteDto } from './dto/add-componente-lote.dto';
import { AddComponenteSubparteLoteDto } from './dto/add-componente-subparte-lote.dto';
import { AddComponenteIndividualDto } from './dto/add-componente-individual.dto';

@Injectable()
export class ProductoSalidaService {
  constructor(private readonly repository: ProductoSalidaRepository) {}

  async create(createProductoSalidaDto: CreateProductoSalidaDto) {
    return this.repository.create(createProductoSalidaDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const producto = await this.repository.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto Salida con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoSalidaDto: UpdateProductoSalidaDto) {
    await this.findOne(id); // Verificar que existe
    return this.repository.update(id, updateProductoSalidaDto);
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar que existe
    return this.repository.remove(id);
  }

  // ========== COMPONENTES ==========
  async addComponenteSubparte(addComponenteSubparteDto: AddComponenteSubparteDto) {
    return this.repository.addComponenteSubparte(addComponenteSubparteDto);
  }

  async removeComponenteSubparte(
    productoSalidaId: number,
    subparteBaseId: number,
  ) {
    return this.repository.removeComponenteSubparte(
      productoSalidaId,
      subparteBaseId,
    );
  }

  async addComponenteLote(addComponenteLoteDto: AddComponenteLoteDto) {
    return this.repository.addComponenteLote(addComponenteLoteDto);
  }

  async removeComponenteLote(productoSalidaId: number, loteId: number) {
    return this.repository.removeComponenteLote(productoSalidaId, loteId);
  }

  async addComponenteSubparteLote(
    addComponenteSubparteLoteDto: AddComponenteSubparteLoteDto,
  ) {
    return this.repository.addComponenteSubparteLote(
      addComponenteSubparteLoteDto,
    );
  }

  async removeComponenteSubparteLote(
    productoSalidaId: number,
    subparteLoteId: number,
  ) {
    return this.repository.removeComponenteSubparteLote(
      productoSalidaId,
      subparteLoteId,
    );
  }

  async addComponenteIndividual(
    addComponenteIndividualDto: AddComponenteIndividualDto,
  ) {
    return this.repository.addComponenteIndividual(addComponenteIndividualDto);
  }

  async removeComponenteIndividual(
    productoSalidaId: number,
    loteIndividualId: number,
  ) {
    return this.repository.removeComponenteIndividual(
      productoSalidaId,
      loteIndividualId,
    );
  }
}
