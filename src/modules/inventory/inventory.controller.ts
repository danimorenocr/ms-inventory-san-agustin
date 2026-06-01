import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ConsumeProductoSalidaDto } from './dto/consume-product.dto';
import { DescontarProductoSalidaDto } from './dto/descontar-producto-salida.dto';
import { ReservaParaCombosDto } from './dto/reserva-para-combos.dto';
import { ValidateStockDto } from './dto/validate-stock.dto';

@Controller('')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post('consume-product')
  consumirProducto(@Body() dto: ConsumeProductoSalidaDto) {
    return this.inventoryService.consumirProductoSalida(dto);
  }

  @Post('validate-stock')
  validateStock(@Body() dto: ValidateStockDto) {
    return this.inventoryService.validateStock(dto);
  }

  @Post('reintegrar-producto')
  reintegrarProducto(@Body() dto: ConsumeProductoSalidaDto) {
    console.log('🔍 CONTROLLER - Body recibido:', JSON.stringify(dto, null, 2));
    console.log('🔍 CONTROLLER - Tipo de dto:', typeof dto);
    console.log('🔍 CONTROLLER - Keys del dto:', Object.keys(dto));
    return this.inventoryService.reintegrarProductoSalida(dto);
  }

  @Post('productos-salida/:id/descontar')
  descontarProductoSalida(
    @Param('id', ParseIntPipe) productoSalidaId: number,
    @Body() dto: DescontarProductoSalidaDto,
  ) {
    return this.inventoryService.descontarProductoSalidaCombo(productoSalidaId, dto);
  }

  @Post('subpartes-base/:id/reserve')
  reservarSubparteParaCombos(
    @Param('id', ParseIntPipe) subparteBaseId: number,
    @Body() dto: ReservaParaCombosDto,
  ) {
    return this.inventoryService.reservarSubparteParaCombos(subparteBaseId, dto);
  }

  @Post('productos-base/:id/reserve')
  reservarProductoParaCombos(
    @Param('id', ParseIntPipe) productoBaseId: number,
    @Body() dto: ReservaParaCombosDto,
  ) {
    return this.inventoryService.reservarProductoParaCombos(productoBaseId, dto);
  }
}
