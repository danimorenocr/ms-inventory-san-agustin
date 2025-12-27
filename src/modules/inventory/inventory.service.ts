import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';
import { FIFOService } from './fifo/fifo.service';
import { ConsumeProductoSalidaDto } from './dto/consume-product.dto';
import { ValidateStockDto } from './dto/validate-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private fifo: FIFOService,
  ) { }

  async consumirProductoSalida(dto: ConsumeProductoSalidaDto) {
    const producto = await this.prisma.productoSalida.findUnique({
      where: { id: dto.productoSalidaId },
      include: {
        componentes: true,
      },
    });

    if (!producto) {
      throw new BadRequestException('Producto de salida no existe');
    }

    if (producto.componentes.length === 0) {
      throw new BadRequestException(
        'Producto sin componentes definidos',
      );
    }

    const pesoPorComponente =
      dto.pesoTotal / producto.componentes.length;

    for (const componente of producto.componentes) {
      await this.fifo.consumirSubparte(
        componente.subparteBaseId,
        pesoPorComponente,
        dto.referenciaVentaId,
      );
    }

    return {
      message: 'Inventario descontado correctamente',
    };
  }
  async validateStock(dto: ValidateStockDto) {
    const missingItems = [];

    for (const item of dto.items) {
      const totalStock = await this.prisma.subparteLote.aggregate({
        where: {
          idSubparteBase: item.subparteBaseId,
          pesoSubparteKg: { gt: 0 },
        },
        _sum: {
          pesoSubparteKg: true,
        },
      });

      const disponible = totalStock._sum.pesoSubparteKg || 0;

      if (disponible < item.pesoRequerido) {
        // Fetch name for better error message
        const subparteInfo = await this.prisma.subparteBase.findUnique({
          where: { id: item.subparteBaseId }
        });

        missingItems.push({
          subparteBaseId: item.subparteBaseId,
          nombre: subparteInfo?.nombre || 'Desconocido',
          requerido: item.pesoRequerido,
          disponible,
        });
      }
    }

    return {
      success: missingItems.length === 0,
      missingItems,
    };
  }
}
