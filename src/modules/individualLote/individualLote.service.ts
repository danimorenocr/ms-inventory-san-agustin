import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoteIndividualDto } from './dto/create-individuallote.dto';
import { UpdateLoteIndividualDto } from './dto/update-individuallote.dto';
import { LoteIndividualRepository } from './repository/individualLote.repository';

@Injectable()
export class LoteIndividualService {
  constructor(private readonly repository: LoteIndividualRepository) { }

  async create(createLoteIndividualDto: CreateLoteIndividualDto) {
    return this.repository.create(createLoteIndividualDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(idLote: number) {
    const loteIndividual = await this.repository.findOne(idLote);
    if (!loteIndividual) {
      throw new NotFoundException(`Lote individual con ID ${idLote} no encontrado`);
    }
    return loteIndividual;
  }

  async findByProducto(idProductoBase: number) {
    return this.repository.findByProducto(idProductoBase);
  }

  async update(idLote: number, updateLoteIndividualDto: UpdateLoteIndividualDto) {
    await this.findOne(idLote);
    return this.repository.update(idLote, updateLoteIndividualDto);
  }

  async remove(idLote: number) {
    await this.findOne(idLote);
    return this.repository.remove(idLote);
  }

  async getTotalPorProducto() {
    return this.repository.getTotalPorProducto();
  }
}
