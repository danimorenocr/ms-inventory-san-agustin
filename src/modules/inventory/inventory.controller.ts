import { Controller, Post, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ConsumeProductoSalidaDto } from './dto/consume-product.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('consume-product')
  consumirProducto(@Body() dto: ConsumeProductoSalidaDto) {
    return this.inventoryService.consumirProductoSalida(dto);
  }
}
