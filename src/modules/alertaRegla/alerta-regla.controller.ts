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
import { AlertaReglaService } from './alerta-regla.service';
import { CreateAlertaReglaDto } from './dto/create-alerta-regla.dto';
import { UpdateAlertaReglaDto } from './dto/update-alerta-regla.dto';

@ApiTags('Reglas de Alerta')
@Controller('alertas-reglas')
export class AlertaReglaController {
  constructor(private readonly alertaReglaService: AlertaReglaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva regla de alerta' })
  @ApiResponse({ status: 201, description: 'Regla de alerta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createAlertaReglaDto: CreateAlertaReglaDto) {
    return this.alertaReglaService.create(createAlertaReglaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reglas de alerta' })
  @ApiQuery({ name: 'tipo', required: false, description: 'Filtrar por tipo de regla' })
  @ApiQuery({ name: 'activas', required: false, description: 'Mostrar solo reglas activas', type: Boolean })
  @ApiQuery({ name: 'loteId', required: false, description: 'Filtrar por ID de lote' })
  @ApiResponse({ status: 200, description: 'Lista de reglas de alerta' })
  findAll(
    @Query('tipo') tipo?: string,
    @Query('activas') activas?: string,
    @Query('loteId') loteId?: string,
  ) {
    if (activas === 'true') {
      return this.alertaReglaService.findActivas();
    }
    if (tipo) {
      return this.alertaReglaService.findByTipo(tipo);
    }
    if (loteId) {
      return this.alertaReglaService.findByLote(+loteId);
    }
    return this.alertaReglaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una regla de alerta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la regla de alerta' })
  @ApiResponse({ status: 200, description: 'Regla de alerta encontrada' })
  @ApiResponse({ status: 404, description: 'Regla de alerta no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alertaReglaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una regla de alerta' })
  @ApiParam({ name: 'id', description: 'ID de la regla de alerta' })
  @ApiResponse({ status: 200, description: 'Regla de alerta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Regla de alerta no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlertaReglaDto: UpdateAlertaReglaDto,
  ) {
    return this.alertaReglaService.update(id, updateAlertaReglaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una regla de alerta' })
  @ApiParam({ name: 'id', description: 'ID de la regla de alerta' })
  @ApiResponse({ status: 200, description: 'Regla de alerta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Regla de alerta no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alertaReglaService.remove(id);
  }
}
