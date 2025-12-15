import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';

@Injectable()
export class FIFOService {
  constructor(private prisma: PrismaService) {}

  async consumirSubparte(
    subparteBaseId: number,
    pesoNecesario: number,
    referenciaId?: number,
  ) {
    const subpartes = await this.prisma.subparteLote.findMany({
      where: {
        idSubparteBase: subparteBaseId,
        pesoSubparteKg: { gt: 0 },
      },
      orderBy: {
        fechaPesado: 'asc',
      },
    });

    let restante = pesoNecesario;

    for (const subparte of subpartes) {
      if (restante <= 0) break;

      const descuento = Math.min(subparte.pesoSubparteKg, restante);

      await this.prisma.subparteLote.update({
        where: { id: subparte.id },
        data: {
          pesoSubparteKg: { decrement: descuento },
        },
      });

      await this.prisma.movimientoInventario.create({
        data: {
          tipo: 'VENTA',
          referenciaId,
          subparteLoteId: subparte.id,
          subparteBaseId,
          peso: descuento,
        },
      });

      restante -= descuento;
    }

    if (restante > 0) {
      throw new BadRequestException(
        'Stock insuficiente para la subparte',
      );
    }
  }
}
