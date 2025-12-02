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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LoteService } from './lote.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@ApiTags('Lotes')
@Controller('lotes')
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lote' })
  @ApiResponse({ status: 201, description: 'Lote creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.loteService.create(createLoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los lotes' })
  @ApiQuery({ name: 'tipoAnimal', required: false, enum: ['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'] })
  @ApiQuery({ name: 'tipoIngreso', required: false, enum: ['matadero', 'compra_individual'] })
  @ApiResponse({ status: 200, description: 'Lista de lotes' })
  findAll(
    @Query('tipoAnimal') tipoAnimal?: string,
    @Query('tipoIngreso') tipoIngreso?: string,
  ) {
    if (tipoAnimal) {
      return this.loteService.findByTipoAnimal(tipoAnimal);
    }
    if (tipoIngreso) {
      return this.loteService.findByTipoIngreso(tipoIngreso);
    }
    return this.loteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lote por ID' })
  @ApiParam({ name: 'id', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote encontrado' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un lote' })
  @ApiParam({ name: 'id', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.loteService.update(id, updateLoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lote' })
  @ApiParam({ name: 'id', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loteService.remove(id);
  }
}
