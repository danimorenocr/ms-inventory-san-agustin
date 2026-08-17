import { Injectable } from '@nestjs/common';
import { PrismaLocalService } from '../../../infraestructure/prisma/prisma-local.service';
import { CreateAlertaDto } from '../dto/create-alert.dto';
import { UpdateAlertaDto } from '../dto/update-alert.dto';

@Injectable()
export class AlertRepository {
  constructor(private readonly prisma: PrismaLocalService) {}

  async create(createAlertaDto: CreateAlertaDto) {
    return this.prisma.alerta.create({
      data: createAlertaDto,
    });
  }

  async findAll() {
    return this.prisma.alerta.findMany({
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findUnread() {
    return this.prisma.alerta.findMany({
      where: { leida: false },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findByTipo(tipo: string) {
    return this.prisma.alerta.findMany({
      where: { tipo },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.alerta.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateAlertaDto: UpdateAlertaDto) {
    return this.prisma.alerta.update({
      where: { id },
      data: updateAlertaDto,
    });
  }

  async markAsRead(id: number) {
    return this.prisma.alerta.update({
      where: { id },
      data: { leida: true },
    });
  }

  async markAllAsRead() {
    return this.prisma.alerta.updateMany({
      where: { leida: false },
      data: { leida: true },
    });
  }

  async remove(id: number) {
    return this.prisma.alerta.delete({
      where: { id },
    });
  }

  async removeAll() {
    return this.prisma.alerta.deleteMany({});
  }
}
