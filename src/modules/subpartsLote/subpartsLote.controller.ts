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
  @ApiOperation({ summary: 'Obtener todas las subpartes de lote' })
  @ApiQuery({ name: 'idLote', required: false, description: 'Filtrar por ID de lote' })
  @ApiQuery({ name: 'idCategoriaLote', required: false, description: 'Filtrar por ID de categoría de lote' })
  @ApiQuery({ name: 'idSubparteBase', required: false, description: 'Filtrar por ID de subparte base' })
  @ApiResponse({ status: 200, description: 'Lista de subpartes de lote' })
  findAll(
    @Query('idLote', new ParseIntPipe({ optional: true })) idLote?: number,
    @Query('idCategoriaLote', new ParseIntPipe({ optional: true })) idCategoriaLote?: number,
    @Query('idSubparteBase', new ParseIntPipe({ optional: true })) idSubparteBase?: number,
  ) {
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
