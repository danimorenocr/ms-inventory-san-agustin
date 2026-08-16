import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovimientoInventarioDto } from '../registroMerma/dto/create-movimiento-inventario.dto';
import { UpdateMovimientoInventarioDto } from '../registroMerma/dto/update-movimiento-inventario.dto';
import { MovimientoInventarioRepository } from '../registroMerma/repository/movimiento-inventario.repository';

@Injectable()
export class MovimientoInventarioService {
  constructor(
    private readonly repository: MovimientoInventarioRepository,
  ) {}

  async create(createMovimientoInventarioDto: CreateMovimientoInventarioDto) {
    return this.repository.create(createMovimientoInventarioDto);
  }

  async findAll(skip?: number, take?: number) {
    return this.repository.findAll(skip, take);
  }

  async findOne(id: number) {
    const movimiento = await this.repository.findOne(id);
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    return movimiento;
  }

  async update(id: number, updateMovimientoInventarioDto: UpdateMovimientoInventarioDto) {
    const movimiento = await this.repository.findOne(id);
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    return this.repository.update(id, updateMovimientoInventarioDto);
  }

  async remove(id: number) {
    const movimiento = await this.repository.findOne(id);
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    return this.repository.remove(id);
  }
}
