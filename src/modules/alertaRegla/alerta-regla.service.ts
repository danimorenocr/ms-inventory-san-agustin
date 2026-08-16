import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertaReglaDto } from './dto/create-alerta-regla.dto';
import { UpdateAlertaReglaDto } from './dto/update-alerta-regla.dto';
import { AlertaReglaRepository } from './repository/alerta-regla.repository';

@Injectable()
export class AlertaReglaService {
  constructor(private readonly repository: AlertaReglaRepository) {}

  async create(createAlertaReglaDto: CreateAlertaReglaDto) {
    return this.repository.create(createAlertaReglaDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findActivas() {
    return this.repository.findActivas();
  }

  async findByTipo(tipo: string) {
    return this.repository.findByTipo(tipo);
  }

  async findByLote(loteId: number) {
    return this.repository.findByLote(loteId);
  }

  async findOne(id: number) {
    const regla = await this.repository.findOne(id);
    if (!regla) {
      throw new NotFoundException(`Regla de alerta con ID ${id} no encontrada`);
    }
    return regla;
  }

  async update(id: number, updateAlertaReglaDto: UpdateAlertaReglaDto) {
    await this.findOne(id);
    return this.repository.update(id, updateAlertaReglaDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
