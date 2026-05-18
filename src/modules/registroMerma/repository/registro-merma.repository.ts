import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';
import { CreateRegistroMermaDto } from '../dto/create-registro-merma.dto';
import { UpdateRegistroMermaDto } from '../dto/update-registro-merma.dto';

@Injectable()
export class RegistroMermaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegistroMermaDto) {
    throw new Error('registroMerma model not implemented in schema');
  }

  async findAll() {
    throw new Error('registroMerma model not implemented in schema');
  }

  async findOne(id: number) {
    throw new Error('registroMerma model not implemented in schema');
  }

  async findByLote(idLote: number) {
    throw new Error('registroMerma model not implemented in schema');
  }

  async update(id: number, dto: UpdateRegistroMermaDto) {
    throw new Error('registroMerma model not implemented in schema');
  }

  async remove(id: number) {
    throw new Error('registroMerma model not implemented in schema');
  }
}
