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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Productos Base')
@Controller('products-base')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto base' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos base activos' })
  @ApiQuery({ name: 'categoria', required: false, description: 'Filtrar por categoría (vísceras, pescado, pollo, etc.)' })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  findAll(@Query('categoria') categoria?: string) {
    if (categoria) {
      return this.productsService.findByCategoria(categoria);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto base por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto base' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un producto base (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Eliminar permanentemente un producto base' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado permanentemente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.hardDelete(id);
  }
}
