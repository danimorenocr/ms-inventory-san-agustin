import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertaDto } from './dto/create-alert.dto';
import { UpdateAlertaDto } from './dto/update-alert.dto';
import { AlertRepository } from './repository/alert.repository';

@Injectable()
export class AlertService {
  constructor(private readonly repository: AlertRepository) {}

  async create(createAlertaDto: CreateAlertaDto) {
    return this.repository.create(createAlertaDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findUnread() {
    return this.repository.findUnread();
  }

  async findByTipo(tipo: string) {
    return this.repository.findByTipo(tipo);
  }

  async findOne(id: number) {
    const alert = await this.repository.findOne(id);
    if (!alert) {
      throw new NotFoundException(`Alerta con ID ${id} no encontrada`);
    }
    return alert;
  }

  async update(id: number, updateAlertaDto: UpdateAlertaDto) {
    await this.findOne(id);
    return this.repository.update(id, updateAlertaDto);
  }

  async markAsRead(id: number) {
    await this.findOne(id);
    return this.repository.markAsRead(id);
  }

  async markAllAsRead() {
    return this.repository.markAllAsRead();
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async removeAll() {
    return this.repository.removeAll();
  }
}
