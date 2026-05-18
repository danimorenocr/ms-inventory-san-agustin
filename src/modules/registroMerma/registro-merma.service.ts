import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRegistroMermaDto } from './dto/create-registro-merma.dto';
import { UpdateRegistroMermaDto } from './dto/update-registro-merma.dto';
import { RegistroMermaRepository } from './repository/registro-merma.repository';

@Injectable()
export class RegistroMermaService {
  constructor(private readonly repository: RegistroMermaRepository) {}

  async create(createRegistroMermaDto: CreateRegistroMermaDto) {
    throw new ConflictException('registroMerma module not implemented');
  }

  async findAll() {
    throw new NotFoundException('registroMerma module not implemented');
  }

  async findOne(id: number) {
    throw new NotFoundException('registroMerma module not implemented');
  }

  async findByLote(idLote: number) {
    throw new NotFoundException('registroMerma module not implemented');
  }

  async update(id: number, updateRegistroMermaDto: UpdateRegistroMermaDto) {
    throw new NotFoundException('registroMerma module not implemented');
  }

  async remove(id: number) {
    throw new NotFoundException('registroMerma module not implemented');
  }
}
