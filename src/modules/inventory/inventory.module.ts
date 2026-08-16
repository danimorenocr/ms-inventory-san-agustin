import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { FIFOService } from './fifo/fifo.service';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, FIFOService, PrismaService],
  exports: [InventoryService, FIFOService],
})
export class InventoryModule { }
