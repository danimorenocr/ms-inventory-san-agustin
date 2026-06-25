import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateAlertaReglaDto } from '../dto/create-alerta-regla.dto';
import { UpdateAlertaReglaDto } from '../dto/update-alerta-regla.dto';

@Injectable()
export class AlertaReglaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAlertaReglaDto) {
    console.log("DTO recibido:", dto);
    return this.prisma.alertaRegla.create({
      data: dto,
      include: {
        lote: true,
        categoriaLote: true,
        subparteLote: true,
        loteIndividual: true,
        producto: true,
        subparteBase: true,
      },
    });
  }

  async findAll() {
    return this.prisma.alertaRegla.findMany({
      include: {
        lote: true,
        categoriaLote: true,
        subparteLote: true,
        loteIndividual: true,
        producto: true,
        subparteBase: true,
      },
    });
  }

  async findActivas() {
    return this.prisma.alertaRegla.findMany({
      where: { activa: true },
      include: {
        lote: true,
        categoriaLote: true,
        subparteLote: true,
        loteIndividual: true,
        producto: true,
        subparteBase: true,
      },
    });
  }

  async findByTipo(tipo: string) {
    return this.prisma.alertaRegla.findMany({
      where: { tipo },
      include: {
        lote: true,
        categoriaLote: true,
        subparteLote: true,
        loteIndividual: true,
        producto: true,
        subparteBase: true,
      },
    });
  }

  async findByLote(loteId: number) {
    return this.prisma.alertaRegla.findMany({
      where: { loteId },
      include: {
        lote: true,
        categoriaLote: true,
        subparteLote: true,
        loteIndividual: true,
        producto: true,
        subparteBase: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.alertaRegla.findUnique({
      where: { id },
      include: {
        lote: true,
        categoriaLote: true,
        subparteLote: true,
        loteIndividual: true,
        producto: true,
        subparteBase: true,
      },
    });
  }

  async update(id: number, dto: UpdateAlertaReglaDto) {
    return this.prisma.alertaRegla.update({
      where: { id },
      data: dto,
      include: {
        lote: true,
        categoriaLote: true,
        subparteLote: true,
        loteIndividual: true,
        producto: true,
        subparteBase: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.alertaRegla.delete({
      where: { id },
    });
  }
}
