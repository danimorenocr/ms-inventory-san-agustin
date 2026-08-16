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
import { AlertService } from './alert.service';
import { CreateAlertaDto } from './dto/create-alert.dto';
import { UpdateAlertaDto } from './dto/update-alert.dto';

@ApiTags('Alertas')
@Controller('alertas')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva alerta' })
  @ApiResponse({ status: 201, description: 'Alerta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createAlertaDto: CreateAlertaDto) {
    return this.alertService.create(createAlertaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las alertas' })
  @ApiQuery({ name: 'tipo', required: false, description: 'Filtrar por tipo de alerta' })
  @ApiQuery({ name: 'noLeidas', required: false, description: 'Mostrar solo alertas no leídas', type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de alertas' })
  async findAll(
    @Query('tipo') tipo?: string,
    @Query('noLeidas') noLeidas?: string,
  ) {
    await this.alertService.checkRules();
    
    if (noLeidas === 'true') {
      return this.alertService.findUnread();
    }
    if (tipo) {
      return this.alertService.findByTipo(tipo);
    }
    return this.alertService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una alerta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la alerta' })
  @ApiResponse({ status: 200, description: 'Alerta encontrada' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alertService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una alerta' })
  @ApiParam({ name: 'id', description: 'ID de la alerta' })
  @ApiResponse({ status: 200, description: 'Alerta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlertaDto: UpdateAlertaDto,
  ) {
    return this.alertService.update(id, updateAlertaDto);
  }

  @Patch(':id/marcar-leida')
  @ApiOperation({ summary: 'Marcar una alerta como leída' })
  @ApiParam({ name: 'id', description: 'ID de la alerta' })
  @ApiResponse({ status: 200, description: 'Alerta marcada como leída' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.alertService.markAsRead(id);
  }

  @Patch('marcar-todas-leidas')
  @ApiOperation({ summary: 'Marcar todas las alertas como leídas' })
  @ApiResponse({ status: 200, description: 'Todas las alertas marcadas como leídas' })
  markAllAsRead() {
    return this.alertService.markAllAsRead();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una alerta' })
  @ApiParam({ name: 'id', description: 'ID de la alerta' })
  @ApiResponse({ status: 200, description: 'Alerta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alertService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar todas las alertas' })
  @ApiResponse({ status: 200, description: 'Todas las alertas eliminadas exitosamente' })
  removeAll() {
    return this.alertService.removeAll();
  }
}
