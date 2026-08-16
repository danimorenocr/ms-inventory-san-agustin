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
import { CategoriaLoteService } from './categorielote.service';
import { CreateCategoriaLoteDto } from './dto/create-categorielote.dto';
import { UpdateCategoriaLoteDto } from './dto/update-categorielote.dto';

@ApiTags('Categorías de Lote')
@Controller('categorias-lote')
export class CategoriaLoteController {
  constructor(private readonly categoriaLoteService: CategoriaLoteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría de lote' })
  @ApiResponse({ status: 201, description: 'Categoría de lote creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createCategoriaLoteDto: CreateCategoriaLoteDto) {
    return this.categoriaLoteService.create(createCategoriaLoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías de lote' })
  @ApiQuery({ name: 'idLote', required: false, description: 'Filtrar por ID de lote' })
  @ApiQuery({ name: 'idCategoriaBase', required: false, description: 'Filtrar por ID de categoría base' })
  @ApiResponse({ status: 200, description: 'Lista de categorías de lote' })
  findAll(
    @Query('idLote', new ParseIntPipe({ optional: true })) idLote?: number,
    @Query('idCategoriaBase', new ParseIntPipe({ optional: true })) idCategoriaBase?: number,
  ) {
    if (idLote) {
      return this.categoriaLoteService.findByLote(idLote);
    }
    if (idCategoriaBase) {
      return this.categoriaLoteService.findByCategoriaBase(idCategoriaBase);
    }
    return this.categoriaLoteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría de lote por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría de lote' })
  @ApiResponse({ status: 200, description: 'Categoría de lote encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría de lote no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaLoteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría de lote' })
  @ApiParam({ name: 'id', description: 'ID de la categoría de lote' })
  @ApiResponse({ status: 200, description: 'Categoría de lote actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría de lote no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaLoteDto: UpdateCategoriaLoteDto,
  ) {
    return this.categoriaLoteService.update(id, updateCategoriaLoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría de lote' })
  @ApiParam({ name: 'id', description: 'ID de la categoría de lote' })
  @ApiResponse({ status: 200, description: 'Categoría de lote eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría de lote no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaLoteService.remove(id);
  }
}
