import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateLoteIndividualDto } from '../dto/create-individuallote.dto';
import { UpdateLoteIndividualDto } from '../dto/update-individuallote.dto';

@Injectable()
export class LoteIndividualRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoteIndividualDto: CreateLoteIndividualDto) {
    return this.prisma.loteIndividual.create({
      data: createLoteIndividualDto,
    });
  }

  async findAll() {
    return this.prisma.loteIndividual.findMany({
      include: {
        lote: true,
        producto: true,
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });
  }

  async findOne(idLote: number) {
    return this.prisma.loteIndividual.findUnique({
      where: { idLote },
      include: {
        lote: true,
        producto: true,
      },
    });
  }

  async findByProducto(idProductoBase: number) {
    return this.prisma.loteIndividual.findMany({
      where: { idProductoBase },
      include: {
        lote: true,
        producto: true,
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });
  }

  async update(idLote: number, updateLoteIndividualDto: UpdateLoteIndividualDto) {
    return this.prisma.loteIndividual.update({
      where: { idLote },
      data: updateLoteIndividualDto,
    });
  }

  async remove(idLote: number) {
    return this.prisma.loteIndividual.delete({
      where: { idLote },
    });
  }
}
