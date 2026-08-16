import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRegistroMermaDto } from './dto/create-registro-merma.dto';
import { UpdateRegistroMermaDto } from './dto/update-registro-merma.dto';
import { RegistroMermaRepository } from './repository/registro-merma.repository';

@Injectable()
export class RegistroMermaService {
  constructor(private readonly repository: RegistroMermaRepository) {}

  async create(createRegistroMermaDto: CreateRegistroMermaDto) {
    // Verificar si ya existe un registro para este lote
    const existente = await this.repository.findByLote(createRegistroMermaDto.idLote);
    if (existente) {
      throw new ConflictException(
        `Ya existe un registro de merma para el lote con ID ${createRegistroMermaDto.idLote}`
      );
    }
    return this.repository.create(createRegistroMermaDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const registro = await this.repository.findOne(id);
    if (!registro) {
      throw new NotFoundException(`Registro de merma con ID ${id} no encontrado`);
    }
    return registro;
  }

  async findByLote(idLote: number) {
    const registro = await this.repository.findByLote(idLote);
    if (!registro) {
      throw new NotFoundException(`No existe registro de merma para el lote con ID ${idLote}`);
    }
    return registro;
  }

  async update(id: number, updateRegistroMermaDto: UpdateRegistroMermaDto) {
    await this.findOne(id);
    return this.repository.update(id, updateRegistroMermaDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
