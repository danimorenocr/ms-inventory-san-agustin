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
import { SubparteLoteService } from './subpartsLote.service';
import { CreateSubparteLoteDto } from './dto/create-subpartLote.dto';
import { UpdateSubparteLoteDto } from './dto/update-subpartLote.dto';

@ApiTags('Subpartes de Lote')
@Controller('subpartes-lote')
export class SubparteLoteController {
  constructor(private readonly subparteLoteService: SubparteLoteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva subparte de lote' })
  @ApiResponse({ status: 201, description: 'Subparte de lote creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createSubparteLoteDto: CreateSubparteLoteDto) {
    return this.subparteLoteService.create(createSubparteLoteDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las subpartes de lote',
    description: `
    Obtiene subpartes de lote con filtros opcionales:
    - Sin parámetros: Retorna todas las subpartes
    - idLote + idCategoriaBase: Retorna subpartes de una categoría específica en un lote (Ej: Todas las subpartes de "BRAZOS" del lote 1)
    - idLote: Retorna todas las subpartes del lote
    - idCategoriaLote: Retorna subpartes de una categoría de lote específica
    - idSubparteBase: Retorna todas las instancias de una subparte base en todos los lotes
    `
  })
  @ApiQuery({ 
    name: 'idLote', 
    required: false, 
    type: Number,
    description: 'ID del lote',
    example: 1
  })
  @ApiQuery({ 
    name: 'idCategoriaBase', 
    required: false, 
    type: Number,
    description: 'ID de la categoría base (COGOTE, BRAZOS, etc.). Debe usarse junto con idLote para obtener subpartes de una categoría específica',
    example: 2
  })
  @ApiQuery({ 
    name: 'idCategoriaLote', 
    required: false, 
    type: Number,
    description: 'ID de la categoría de lote (instancia específica de categoría en un lote)',
    example: 5
  })
  @ApiQuery({ 
    name: 'idSubparteBase', 
    required: false, 
    type: Number,
    description: 'ID de la subparte base (Bola de brazo, Murillo, etc.)',
    example: 3
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de subpartes de lote filtradas según los parámetros proporcionados'
  })
  findAll(
    @Query('idLote', new ParseIntPipe({ optional: true })) idLote?: number,
    @Query('idCategoriaBase', new ParseIntPipe({ optional: true })) idCategoriaBase?: number,
    @Query('idCategoriaLote', new ParseIntPipe({ optional: true })) idCategoriaLote?: number,
    @Query('idSubparteBase', new ParseIntPipe({ optional: true })) idSubparteBase?: number,
  ) {
    // Buscar por lote y categoría base combinados
    if (idLote && idCategoriaBase) {
      return this.subparteLoteService.findByLoteAndCategoria(idLote, idCategoriaBase);
    }
    if (idLote) {
      return this.subparteLoteService.findByLote(idLote);
    }
    if (idCategoriaLote) {
      return this.subparteLoteService.findByCategoriaLote(idCategoriaLote);
    }
    if (idSubparteBase) {
      return this.subparteLoteService.findBySubparteBase(idSubparteBase);
    }
    return this.subparteLoteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una subparte de lote por ID' })
  @ApiParam({ name: 'id', description: 'ID de la subparte de lote' })
  @ApiResponse({ status: 200, description: 'Subparte de lote encontrada' })
  @ApiResponse({ status: 404, description: 'Subparte de lote no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subparteLoteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una subparte de lote' })
  @ApiParam({ name: 'id', description: 'ID de la subparte de lote' })
  @ApiResponse({ status: 200, description: 'Subparte de lote actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Subparte de lote no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubparteLoteDto: UpdateSubparteLoteDto,
  ) {
    return this.subparteLoteService.update(id, updateSubparteLoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una subparte de lote' })
  @ApiParam({ name: 'id', description: 'ID de la subparte de lote' })
  @ApiResponse({ status: 200, description: 'Subparte de lote eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Subparte de lote no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subparteLoteService.remove(id);
  }
}
