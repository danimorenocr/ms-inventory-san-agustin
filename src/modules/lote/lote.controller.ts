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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LoteService } from './lote.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@ApiTags('Lotes')
@Controller('lotes')
export class LoteController {
  constructor(private readonly loteService: LoteService) { }

  // ======================================================
  // 📌 CREAR LOTE
  // ======================================================
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo lote' })
  @ApiResponse({ status: 201, description: 'Lote creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() createLoteDto: CreateLoteDto,
    @CurrentUser() user: Express.Request['user'],
  ) {
    console.log("Usuario autenticado:", user);
    return this.loteService.create(createLoteDto, user);
  }

  // ======================================================
  // 📌 LISTAR LOTES CON FILTROS
  // ======================================================
  @Get()
  @ApiOperation({ summary: 'Obtener todos los lotes' })
  @ApiQuery({ name: 'tipoAnimal', required: false })
  @ApiQuery({ name: 'tipoIngreso', required: false })
  @ApiQuery({ name: 'proveedorId', required: false })
  findAll(
    @Query('tipoAnimal') tipoAnimal?: string,
    @Query('tipoIngreso') tipoIngreso?: string,
    @Query('proveedorId') proveedorId?: string,
  ) {
    if (tipoAnimal) return this.loteService.findByTipoAnimal(tipoAnimal);
    if (tipoIngreso) return this.loteService.findByTipoIngreso(tipoIngreso);
    if (proveedorId) return this.loteService.findByProveedorId(+proveedorId);

    return this.loteService.findAll();
  }

  // ======================================================
  // 📌 REPORTES DE CARNE
  // ======================================================

  @Get('reportes/total-carne')
  @ApiOperation({
    summary: 'Obtener el total de carne almacenada (todas las especies)',
  })
  @ApiResponse({
    status: 200,
    description: 'Totales calculados correctamente',
  })
  getTotalCarne() {
    return this.loteService.getTotalCarne();
  }

  @Get('total-carne/tipo')
  @ApiOperation({
    summary:
      'Obtener el total de carne por tipo de animal + total general',
  })
  @ApiResponse({
    status: 200,
    description: 'Totales agrupados por tipo de animal',
  })
  getTotalCarnePorTipo() {
    return this.loteService.getTotalCarnePorTipo();
  }

  @Get('reportes/total-por-subparte')
  @ApiOperation({
    summary: 'Obtener el total de kg por cada subparte',
  })
  @ApiResponse({
    status: 200,
    description: 'Totales agrupados por cada subparte',
  })
  getTotalPorSubparte() {
    return this.loteService.getTotalPorSubparte();
  }

  @Get('reportes/total-por-producto-base')
  @ApiOperation({
    summary: 'Obtener el total de kg por cada producto base',
  })
  @ApiResponse({
    status: 200,
    description: 'Totales agrupados por cada producto base',
  })
  getTotalPorProductoBase() {
    return this.loteService.getTotalPorProductoBase();
  }

  // ======================================================
  // 📌 OBTENER / ACTUALIZAR / ELIMINAR POR ID
  // ======================================================
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lote por ID' })
  @ApiParam({ name: 'id', description: 'ID del lote' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un lote' })
  @ApiParam({ name: 'id', description: 'ID del lote' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.loteService.update(id, updateLoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lote' })
  @ApiParam({ name: 'id', description: 'ID del lote' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loteService.remove(id);
  }
}
