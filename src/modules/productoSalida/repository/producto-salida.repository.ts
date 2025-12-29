import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateProductoSalidaDto } from '../dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from '../dto/update-producto-salida.dto';
import { AddComponenteSubparteDto } from '../dto/add-componente-subparte.dto';
import { AddComponenteLoteDto } from '../dto/add-componente-lote.dto';
import { AddComponenteSubparteLoteDto } from '../dto/add-componente-subparte-lote.dto';
import { AddComponenteIndividualDto } from '../dto/add-componente-individual.dto';

@Injectable()
export class ProductoSalidaRepository {
  constructor(private prisma: PrismaService) { }

  // ========== PRODUCTOS SALIDA ==========
  async create(data: CreateProductoSalidaDto) {
    return this.prisma.productoSalida.create({
      data,
      include: {
        componentes: { include: { subparteBase: true } },
        componentesLote: { include: { lote: true } },
        componentesSubparte: { include: { subparteLote: true } },
        componentesIndividual: { include: { productoBase: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.productoSalida.findMany({
      include: {
        componentes: { include: { subparteBase: true } },
        componentesLote: { include: { lote: true } },
        componentesSubparte: { include: { subparteLote: true } },
        componentesIndividual: { include: { productoBase: true } },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.productoSalida.findUnique({
      where: { id },
      include: {
        componentes: { include: { subparteBase: true } },
        componentesLote: { include: { lote: true } },
        componentesSubparte: { include: { subparteLote: true } },
        componentesIndividual: { include: { productoBase: true } },
      },
    });
  }

  async update(id: number, data: UpdateProductoSalidaDto) {
    return this.prisma.productoSalida.update({
      where: { id },
      data,
      include: {
        componentes: { include: { subparteBase: true } },
        componentesLote: { include: { lote: true } },
        componentesSubparte: { include: { subparteLote: true } },
        componentesIndividual: { include: { productoBase: true } },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.productoSalida.delete({
      where: { id },
    });
  }

  // ========== COMPONENTES SUBPARTE BASE ==========
  async addComponenteSubparte(data: AddComponenteSubparteDto) {
    return this.prisma.productoSalidaComponente.create({
      data,
      include: {
        productoSalida: true,
        subparteBase: true,
      },
    });
  }

  async removeComponenteSubparte(
    productoSalidaId: number,
    subparteBaseId: number,
  ) {
    return this.prisma.productoSalidaComponente.delete({
      where: {
        productoSalidaId_subparteBaseId: {
          productoSalidaId,
          subparteBaseId,
        },
      },
    });
  }

  // ========== COMPONENTES LOTE ==========
  async addComponenteLote(data: AddComponenteLoteDto) {
    return this.prisma.productoSalidaComponenteLote.create({
      data,
      include: {
        productoSalida: true,
        lote: true,
      },
    });
  }

  async removeComponenteLote(productoSalidaId: number, loteId: number) {
    return this.prisma.productoSalidaComponenteLote.delete({
      where: {
        productoSalidaId_loteId: {
          productoSalidaId,
          loteId,
        },
      },
    });
  }

  // ========== COMPONENTES SUBPARTE LOTE ==========
  async addComponenteSubparteLote(data: AddComponenteSubparteLoteDto) {
    return this.prisma.productoSalidaComponenteSubparte.create({
      data,
      include: {
        productoSalida: true,
        subparteLote: true,
      },
    });
  }

  async removeComponenteSubparteLote(
    productoSalidaId: number,
    subparteLoteId: number,
  ) {
    return this.prisma.productoSalidaComponenteSubparte.delete({
      where: {
        productoSalidaId_subparteLoteId: {
          productoSalidaId,
          subparteLoteId,
        },
      },
    });
  }

  // ========== COMPONENTES INDIVIDUAL ==========
  async addComponenteIndividual(data: AddComponenteIndividualDto) {
    return this.prisma.productoSalidaComponenteIndividual.create({
      data,
      include: {
        productoSalida: true,
        productoBase: true,
      },
    });
  }

  async removeComponenteIndividual(
    productoSalidaId: number,
    productoBaseId: number,
  ) {
    return this.prisma.productoSalidaComponenteIndividual.delete({
      where: {
        productoSalidaId_productoBaseId: {
          productoSalidaId,
          productoBaseId,
        },
      },
    });
  }
}
