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
import { ProductoSalidaComponenteService } from '../productsBase/producto-salida-componente.service';
import { CreateProductoSalidaComponenteDto } from '../productsBase/dto/create-producto-salida-componente.dto';
import { UpdateProductoSalidaComponenteDto } from '../productsBase/dto/update-producto-salida-componente.dto';

@ApiTags('Componentes de Productos de Salida')
@Controller('producto-salida-componentes')
export class ProductoSalidaComponenteController {
  constructor(
    private readonly productoSalidaComponenteService: ProductoSalidaComponenteService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo componente de producto de salida' })
  @ApiResponse({ status: 201, description: 'Componente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProductoSalidaComponenteDto: CreateProductoSalidaComponenteDto) {
    return this.productoSalidaComponenteService.create(createProductoSalidaComponenteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los componentes' })
  @ApiResponse({ status: 200, description: 'Componentes obtenidos' })
  findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.productoSalidaComponenteService.findAll(skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un componente por ID' })
  @ApiParam({ name: 'id', description: 'ID del componente' })
  @ApiResponse({ status: 200, description: 'Componente encontrado' })
  @ApiResponse({ status: 404, description: 'Componente no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoSalidaComponenteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un componente' })
  @ApiParam({ name: 'id', description: 'ID del componente' })
  @ApiResponse({ status: 200, description: 'Componente actualizado' })
  @ApiResponse({ status: 404, description: 'Componente no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoSalidaComponenteDto: UpdateProductoSalidaComponenteDto,
  ) {
    return this.productoSalidaComponenteService.update(id, updateProductoSalidaComponenteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un componente' })
  @ApiParam({ name: 'id', description: 'ID del componente' })
  @ApiResponse({ status: 200, description: 'Componente eliminado' })
  @ApiResponse({ status: 404, description: 'Componente no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoSalidaComponenteService.remove(id);
  }
}
