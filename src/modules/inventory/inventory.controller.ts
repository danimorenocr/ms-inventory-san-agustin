import { Controller, Post, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ConsumeProductoSalidaDto } from './dto/consume-product.dto';

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
}
