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

  /**
   * Consume inventario para un ProductoSalida
   * Usa el nuevo sistema de bolsa lógica unificada
   */
  async consumirProductoSalida(dto: ConsumeProductoSalidaDto) {
    return await this.fifo.descontarProductoSalida(
      dto.productoSalidaId,
      dto.pesoTotal,
      dto.referenciaVentaId,
    );
  }

  /**
   * Reintegra inventario para un ProductoSalida (devoluciones)
   * Suma el peso devuelto nuevamente a los lotes
   */
  async reintegrarProductoSalida(dto: ConsumeProductoSalidaDto) {
    console.log('🔍 DEBUG - DTO recibido en reintegrarProductoSalida:', JSON.stringify(dto, null, 2));
    console.log('🔍 DEBUG - productoSalidaId:', dto.productoSalidaId);
    console.log('🔍 DEBUG - pesoTotal:', dto.pesoTotal);
    console.log('🔍 DEBUG - referenciaVentaId:', dto.referenciaVentaId);

    return await this.fifo.reintegrarProductoSalida(
      dto.productoSalidaId,
      dto.pesoTotal,
      dto.referenciaVentaId,
    );
  }

  /**
   * Valida si hay stock suficiente para un ProductoSalida
   * Considera tanto SubparteLote como LoteIndividual
   */
  async validateStock(dto: ValidateStockDto) {
    console.log('\n🟢 ========== VALIDACIÓN DE STOCK ==========');
    console.log(`📋 Validando ${dto.items.length} producto(s)`);

    const missingItems = [];

    for (const item of dto.items) {
      console.log(`\n🔍 Validando ProductoSalidaId: ${item.productoSalidaId}`);
      console.log(`   Peso requerido: ${item.pesoRequerido} kg`);

      // Obtener el ProductoSalida con sus componentes
      const productoSalida = await this.prisma.productoSalida.findUnique({
        where: { id: item.productoSalidaId },
        include: {
          componentes: true,
          componentesIndividual: true,
        },
      });

      if (!productoSalida) {
        console.log(`   ❌ Producto no encontrado`);
        missingItems.push({
          productoSalidaId: item.productoSalidaId,
          nombre: 'Producto no encontrado',
          requerido: item.pesoRequerido,
          disponible: 0,
        });
        continue;
      }

      console.log(`   ✅ Producto: "${productoSalida.nombre}"`);

      // Extraer IDs de componentes
      const subparteBaseIds = productoSalida.componentes.map(
        (c) => c.subparteBaseId,
      );
      const productoBaseIds = productoSalida.componentesIndividual.map(
        (c) => c.productoBaseId,
      );

      console.log(`   📋 SubparteBase IDs: [${subparteBaseIds.join(', ')}]`);
      console.log(`   📋 ProductoBase IDs: [${productoBaseIds.join(', ')}]`);

      // Calcular stock disponible total (SubparteLote + LoteIndividual)
      const [stockSubpartes, stockIndividual] = await Promise.all([
        this.prisma.subparteLote.aggregate({
          where: {
            idSubparteBase: { in: subparteBaseIds },
            pesoSubparteKg: { gt: 0 },
          },
          _sum: {
            pesoSubparteKg: true,
          },
        }),
        this.prisma.loteIndividual.aggregate({
          where: {
            idProductoBase: { in: productoBaseIds },
            pesoKg: { gt: 0 },
          },
          _sum: {
            pesoKg: true,
          },
        }),
      ]);

      const disponibleSubpartes = stockSubpartes._sum.pesoSubparteKg || 0;
      const disponibleIndividual = stockIndividual._sum.pesoKg || 0;
      const disponibleTotal = disponibleSubpartes + disponibleIndividual;

      console.log(`   📊 Stock disponible:`);
      console.log(`      🥩 SubparteLote: ${disponibleSubpartes.toFixed(2)} kg`);
      console.log(`      🛒 LoteIndividual: ${disponibleIndividual.toFixed(2)} kg`);
      console.log(`      📦 TOTAL: ${disponibleTotal.toFixed(2)} kg`);

      if (disponibleTotal < item.pesoRequerido) {
        const faltante = item.pesoRequerido - disponibleTotal;
        console.log(`   ❌ STOCK INSUFICIENTE - Faltan ${faltante.toFixed(2)} kg`);

        missingItems.push({
          productoSalidaId: item.productoSalidaId,
          nombre: productoSalida.nombre,
          requerido: item.pesoRequerido,
          disponible: disponibleTotal,
          faltante: faltante,
        });
      } else {
        console.log(`   ✅ Stock suficiente`);
      }
    }

    const success = missingItems.length === 0;
    console.log(`\n📊 Resultado: ${success ? '✅ VALIDACIÓN EXITOSA' : '❌ STOCK INSUFICIENTE'}`);
    if (!success) {
      console.log(`   Productos con faltante: ${missingItems.length}`);
    }
    console.log('🟢 ========== FIN VALIDACIÓN ==========\n');

    return {
      success,
      missingItems,
    };
  }
}
