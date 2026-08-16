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
import { ProductoSalidaService } from './producto-salida.service';
import { CreateProductoSalidaDto } from './dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from './dto/update-producto-salida.dto';

@ApiTags('Productos de Salida')
@Controller('productos-salida')
export class ProductoSalidaController {
  constructor(private readonly productoSalidaService: ProductoSalidaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto de salida' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProductoSalidaDto: CreateProductoSalidaDto) {
    return this.productoSalidaService.create(createProductoSalidaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos de salida' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos' })
  findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.productoSalidaService.findAll(skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto de salida por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoSalidaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto de salida' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoSalidaDto: UpdateProductoSalidaDto,
  ) {
    return this.productoSalidaService.update(id, updateProductoSalidaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto de salida' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoSalidaService.remove(id);
  }
}
