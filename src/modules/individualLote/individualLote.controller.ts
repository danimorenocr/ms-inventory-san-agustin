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
import { LoteIndividualService } from './individualLote.service';
import { CreateLoteIndividualDto } from './dto/create-individuallote.dto';
import { UpdateLoteIndividualDto } from './dto/update-individuallote.dto';

@ApiTags('Lotes Individuales')
@Controller('lotes-individuales')
export class LoteIndividualController {
  constructor(private readonly loteIndividualService: LoteIndividualService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lote individual' })
  @ApiResponse({ status: 201, description: 'Lote individual creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createLoteIndividualDto: CreateLoteIndividualDto) {
    return this.loteIndividualService.create(createLoteIndividualDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los lotes individuales' })
  @ApiQuery({ name: 'idProductoBase', required: false, description: 'Filtrar por ID de producto base' })
  @ApiResponse({ status: 200, description: 'Lista de lotes individuales' })
  findAll(@Query('idProductoBase', new ParseIntPipe({ optional: true })) idProductoBase?: number) {
    if (idProductoBase) {
      return this.loteIndividualService.findByProducto(idProductoBase);
    }
    return this.loteIndividualService.findAll();
  }

  @Get('reportes/total-por-producto')
  @ApiOperation({ summary: 'Obtener stock total agrupado por ProductoBase' })
  @ApiResponse({ status: 200, description: 'Stock total por producto base' })
  getTotalPorProducto() {
    return this.loteIndividualService.getTotalPorProducto();
  }

  @Get(':idLote')
  @ApiOperation({ summary: 'Obtener un lote individual por ID de lote' })
  @ApiParam({ name: 'idLote', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote individual encontrado' })
  @ApiResponse({ status: 404, description: 'Lote individual no encontrado' })
  findOne(@Param('idLote', ParseIntPipe) idLote: number) {
    return this.loteIndividualService.findOne(idLote);
  }

  @Patch(':idLote')
  @ApiOperation({ summary: 'Actualizar un lote individual' })
  @ApiParam({ name: 'idLote', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote individual actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Lote individual no encontrado' })
  update(
    @Param('idLote', ParseIntPipe) idLote: number,
    @Body() updateLoteIndividualDto: UpdateLoteIndividualDto,
  ) {
    return this.loteIndividualService.update(idLote, updateLoteIndividualDto);
  }

  @Delete(':idLote')
  @ApiOperation({ summary: 'Eliminar un lote individual' })
  @ApiParam({ name: 'idLote', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote individual eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Lote individual no encontrado' })
  remove(@Param('idLote', ParseIntPipe) idLote: number) {
    return this.loteIndividualService.remove(idLote);
  }
}
