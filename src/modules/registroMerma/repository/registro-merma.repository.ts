import { Injectable } from '@nestjs/common';
import { PrismaLocalService } from '../../../infraestructure/prisma/prisma-local.service';
import { CreateRegistroMermaDto } from '../dto/create-registro-merma.dto';
import { UpdateRegistroMermaDto } from '../dto/update-registro-merma.dto';

@Injectable()
export class RegistroMermaRepository {
  constructor(private readonly prisma: PrismaLocalService) {}

  async create(dto: CreateRegistroMermaDto) {
    return this.prisma.registroMerma.create({
      data: dto,
      include: {
        lote: true,
      },
    });
  }

  async findAll() {
    return this.prisma.registroMerma.findMany({
      include: {
        lote: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.registroMerma.findUnique({
      where: { id },
      include: {
        lote: true,
      },
    });
  }

  async findByLote(idLote: number) {
    return this.prisma.registroMerma.findUnique({
      where: { idLote },
      include: {
        lote: true,
      },
    });
  }

  async update(id: number, dto: UpdateRegistroMermaDto) {
    return this.prisma.registroMerma.update({
      where: { id },
      data: dto,
      include: {
        lote: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.registroMerma.delete({
      where: { id },
    });
  }
}
