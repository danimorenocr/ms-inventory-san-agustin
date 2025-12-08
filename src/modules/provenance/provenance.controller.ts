import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProvenanceService } from './provenance.service';
import { CreateProvenanceDto } from './dto/create-provenance.dto';
import { UpdateProvenanceDto } from './dto/update-provenance.dto';

@ApiTags('Procedencia')
@Controller('procedencia')
export class ProvenanceController {
	constructor(private readonly service: ProvenanceService) {}

	@Post()
	@ApiOperation({ summary: 'Crear nueva procedencia' })
	@ApiResponse({ status: 201, description: 'Procedencia creada' })
	create(@Body() dto: CreateProvenanceDto) {
		return this.service.create(dto);
	}

	@Get()
	@ApiOperation({ summary: 'Listar todas las procedencias' })
	findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener una procedencia por ID' })
	@ApiParam({ name: 'id', description: 'ID de la procedencia' })
	@ApiResponse({ status: 200, description: 'Procedencia encontrada' })
	@ApiResponse({ status: 404, description: 'No encontrada' })
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.service.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Actualizar procedencia' })
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProvenanceDto) {
		return this.service.update(id, dto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar procedencia' })
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.service.remove(id);
	}
}
