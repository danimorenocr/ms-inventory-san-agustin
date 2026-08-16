import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MovimientoInventarioService } from '../registroMerma/movimiento-inventario.service';
import { CreateMovimientoInventarioDto } from '../registroMerma/dto/create-movimiento-inventario.dto';
import { UpdateMovimientoInventarioDto } from '../registroMerma/dto/update-movimiento-inventario.dto';

@ApiTags('Movimientos de Inventario')
@Controller('movimientos-inventario')
export class MovimientoInventarioController {
  constructor(
    private readonly movimientoInventarioService: MovimientoInventarioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo movimiento de inventario' })
  @ApiResponse({ status: 201, description: 'Movimiento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createMovimientoInventarioDto: CreateMovimientoInventarioDto) {
    return this.movimientoInventarioService.create(createMovimientoInventarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos de inventario' })
  @ApiResponse({ status: 200, description: 'Movimientos obtenidos' })
  findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.movimientoInventarioService.findAll(skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento encontrado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoInventarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un movimiento' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento actualizado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovimientoInventarioDto: UpdateMovimientoInventarioDto,
  ) {
    return this.movimientoInventarioService.update(id, updateMovimientoInventarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un movimiento' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento eliminado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoInventarioService.remove(id);
  }
}
