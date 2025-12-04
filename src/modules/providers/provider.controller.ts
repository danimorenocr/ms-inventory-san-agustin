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
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@ApiTags('Proveedores')
@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({ status: 201, description: 'Proveedor creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.create(createProviderDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los proveedores activos',
    description: 'Obtiene lista de proveedores con filtros opcionales por tipo de animal o tipo de proveedor'
  })
  @ApiQuery({ 
    name: 'tipoAnimal', 
    required: false, 
    enum: ['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'],
    description: 'Filtrar por tipo de animal que provee',
    example: 'res'
  })
  @ApiQuery({ 
    name: 'tipoProveedor', 
    required: false, 
    enum: ['natural', 'juridica'],
    description: 'Filtrar por tipo de proveedor (persona natural o jurídica)',
    example: 'natural'
  })
  @ApiResponse({ status: 200, description: 'Lista de proveedores filtrados' })
  findAll(
    @Query('tipoAnimal') tipoAnimal?: string,
    @Query('tipoProveedor') tipoProveedor?: string,
  ) {
    if (tipoAnimal) {
      return this.providerService.findByTipoAnimal(tipoAnimal);
    }
    if (tipoProveedor) {
      return this.providerService.findByTipoProveedor(tipoProveedor);
    }
    return this.providerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiParam({ name: 'id', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, description: 'Proveedor encontrado' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.providerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proveedor' })
  @ApiParam({ name: 'id', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, description: 'Proveedor actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providerService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proveedor' })
  @ApiParam({ name: 'id', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, description: 'Proveedor eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.providerService.remove(id);
  }
}
