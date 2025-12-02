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
import { CategoriesBaseService } from './categories.service';
import { CreateCategoryBaseDto } from './dto/create-category.dto';
import { UpdateCategoryBaseDto } from './dto/update-category.dto';

@ApiTags('Categorías Base')
@Controller('categories-base')
export class CategoriesBaseController {
  constructor(private readonly categoriesService: CategoriesBaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría base' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createCategoryDto: CreateCategoryBaseDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías base activas' })
  @ApiQuery({ name: 'tipoAnimal', required: false, enum: ['res', 'cerdo', 'pollo', 'pescado', 'individual'] })
  @ApiResponse({ status: 200, description: 'Lista de categorías' })
  findAll(@Query('tipoAnimal') tipoAnimal?: string) {
    if (tipoAnimal) {
      return this.categoriesService.findByTipoAnimal(tipoAnimal);
    }
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría base por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría base' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryBaseDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una categoría base (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Eliminar permanentemente una categoría base' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada permanentemente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.hardDelete(id);
  }
}
