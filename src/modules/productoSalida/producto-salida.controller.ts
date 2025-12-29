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
import { ProductoSalidaService } from './producto-salida.service';
import { CreateProductoSalidaDto } from './dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from './dto/update-producto-salida.dto';
import { AddComponenteSubparteDto } from './dto/add-componente-subparte.dto';
import { AddComponenteLoteDto } from './dto/add-componente-lote.dto';
import { AddComponenteSubparteLoteDto } from './dto/add-componente-subparte-lote.dto';
import { AddComponenteIndividualDto } from './dto/add-componente-individual.dto';

@Controller('productos-salida')
export class ProductoSalidaController {
  constructor(private readonly service: ProductoSalidaService) { }

  @Post()
  create(@Body() createProductoSalidaDto: CreateProductoSalidaDto) {
    return this.service.create(createProductoSalidaDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoSalidaDto: UpdateProductoSalidaDto,
  ) {
    return this.service.update(id, updateProductoSalidaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ========== COMPONENTES SUBPARTE BASE ==========
  @Post('componentes/subparte-base')
  addComponenteSubparte(
    @Body() addComponenteSubparteDto: AddComponenteSubparteDto,
  ) {
    return this.service.addComponenteSubparte(addComponenteSubparteDto);
  }

  @Delete('componentes/subparte-base/:productoSalidaId/:subparteBaseId')
  removeComponenteSubparte(
    @Param('productoSalidaId', ParseIntPipe) productoSalidaId: number,
    @Param('subparteBaseId', ParseIntPipe) subparteBaseId: number,
  ) {
    return this.service.removeComponenteSubparte(
      productoSalidaId,
      subparteBaseId,
    );
  }

  // ========== COMPONENTES LOTE ==========
  @Post('componentes/lote')
  addComponenteLote(@Body() addComponenteLoteDto: AddComponenteLoteDto) {
    return this.service.addComponenteLote(addComponenteLoteDto);
  }

  @Delete('componentes/lote/:productoSalidaId/:loteId')
  removeComponenteLote(
    @Param('productoSalidaId', ParseIntPipe) productoSalidaId: number,
    @Param('loteId', ParseIntPipe) loteId: number,
  ) {
    return this.service.removeComponenteLote(productoSalidaId, loteId);
  }

  // ========== COMPONENTES SUBPARTE LOTE ==========
  @Post('componentes/subparte-lote')
  addComponenteSubparteLote(
    @Body() addComponenteSubparteLoteDto: AddComponenteSubparteLoteDto,
  ) {
    return this.service.addComponenteSubparteLote(addComponenteSubparteLoteDto);
  }

  @Delete('componentes/subparte-lote/:productoSalidaId/:subparteLoteId')
  removeComponenteSubparteLote(
    @Param('productoSalidaId', ParseIntPipe) productoSalidaId: number,
    @Param('subparteLoteId', ParseIntPipe) subparteLoteId: number,
  ) {
    return this.service.removeComponenteSubparteLote(
      productoSalidaId,
      subparteLoteId,
    );
  }

  // ========== COMPONENTES INDIVIDUAL ==========
  @Post('componentes/individual')
  addComponenteIndividual(
    @Body() addComponenteIndividualDto: AddComponenteIndividualDto,
  ) {
    return this.service.addComponenteIndividual(addComponenteIndividualDto);
  }

  @Delete('componentes/individual/:productoSalidaId/:productoBaseId')
  removeComponenteIndividual(
    @Param('productoSalidaId', ParseIntPipe) productoSalidaId: number,
    @Param('productoBaseId', ParseIntPipe) productoBaseId: number,
  ) {
    return this.service.removeComponenteIndividual(
      productoSalidaId,
      productoBaseId,
    );
  }
}
