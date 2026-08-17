import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { FIFOService } from './fifo/fifo.service';
import { PrismaLocalService } from '../../infraestructure/prisma/prisma-local.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, FIFOService, PrismaLocalService],
  exports: [InventoryService, FIFOService],
})
export class InventoryModule { }
