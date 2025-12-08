import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegistroMermaService } from './registro-merma.service';
import { CreateRegistroMermaDto } from './dto/create-registro-merma.dto';
import { UpdateRegistroMermaDto } from './dto/update-registro-merma.dto';

@ApiTags('Registro de Merma')
@Controller('registros-merma')
export class RegistroMermaController {
  constructor(private readonly registroMermaService: RegistroMermaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de merma' })
  @ApiResponse({ status: 201, description: 'Registro de merma creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un registro de merma para este lote' })
  create(@Body() createRegistroMermaDto: CreateRegistroMermaDto) {
    return this.registroMermaService.create(createRegistroMermaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de merma' })
  @ApiResponse({ status: 200, description: 'Lista de registros de merma' })
  findAll() {
    return this.registroMermaService.findAll();
  }

  @Get('lote/:idLote')
  @ApiOperation({ summary: 'Obtener registro de merma por ID de lote' })
  @ApiParam({ name: 'idLote', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Registro de merma encontrado' })
  @ApiResponse({ status: 404, description: 'Registro de merma no encontrado' })
  findByLote(@Param('idLote', ParseIntPipe) idLote: number) {
    return this.registroMermaService.findByLote(idLote);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de merma por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro de merma' })
  @ApiResponse({ status: 200, description: 'Registro de merma encontrado' })
  @ApiResponse({ status: 404, description: 'Registro de merma no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registroMermaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro de merma' })
  @ApiParam({ name: 'id', description: 'ID del registro de merma' })
  @ApiResponse({ status: 200, description: 'Registro de merma actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro de merma no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegistroMermaDto: UpdateRegistroMermaDto,
  ) {
    return this.registroMermaService.update(id, updateRegistroMermaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro de merma' })
  @ApiParam({ name: 'id', description: 'ID del registro de merma' })
  @ApiResponse({ status: 200, description: 'Registro de merma eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro de merma no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.registroMermaService.remove(id);
  }
}
