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
import { SubpartsService } from './subparts.service';
import { CreatesubpartDto } from './dto/create-subpart.dto';
import { UpdatesubpartDto } from './dto/update-subpart.dto';

@ApiTags('Subpartes Base')
@Controller('subparts-base')
export class SubpartsController {
  constructor(private readonly subpartsService: SubpartsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva subparte base' })
  @ApiResponse({ status: 201, description: 'Subparte creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createSubpartDto: CreatesubpartDto) {
    return this.subpartsService.create(createSubpartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las subpartes base activas' })
  @ApiQuery({ name: 'tipoAnimal', required: false, enum: ['res', 'cerdo', 'pollo', 'pescado', 'individual'] })
  @ApiResponse({ status: 200, description: 'Lista de subpartes' })
  findAll(@Query('tipoAnimal') tipoAnimal?: string) {
    if (tipoAnimal) {
      return this.subpartsService.findByTipoAnimal(tipoAnimal);
    }
    return this.subpartsService.findAll();
  }

  // IMPORTANTE: Esta ruta debe estar ANTES de @Get(':id') para que funcione
  @Get('bulk')
  @ApiOperation({ summary: 'Obtener múltiples subpartes por IDs' })
  @ApiQuery({ name: 'ids', description: 'IDs separados por comas', example: '1,2,3' })
  @ApiResponse({ status: 200, description: 'Lista de subpartes encontradas' })
  findByIds(@Query('ids') ids: string) {
    if (!ids) {
      return [];
    }
    const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    return this.subpartsService.findByIds(idArray);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una subparte base por ID' })
  @ApiParam({ name: 'id', description: 'ID de la subparte' })
  @ApiResponse({ status: 200, description: 'Subparte encontrada' })
  @ApiResponse({ status: 404, description: 'Subparte no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subpartsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una subparte base' })
  @ApiParam({ name: 'id', description: 'ID de la subparte' })
  @ApiResponse({ status: 200, description: 'Subparte actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Subparte no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubpartDto: UpdatesubpartDto,
  ) {
    return this.subpartsService.update(id, updateSubpartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una subparte base (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID de la subparte' })
  @ApiResponse({ status: 200, description: 'Subparte desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Subparte no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subpartsService.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Eliminar permanentemente una subparte base' })
  @ApiParam({ name: 'id', description: 'ID de la subparte' })
  @ApiResponse({ status: 200, description: 'Subparte eliminada permanentemente' })
  @ApiResponse({ status: 404, description: 'Subparte no encontrada' })
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.subpartsService.hardDelete(id);
  }
}
