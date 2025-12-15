import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';
import { FIFOService } from './fifo/fifo.service';
import { ConsumeProductoSalidaDto } from './dto/consume-product.dto';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private fifo: FIFOService,
  ) {}

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
}
