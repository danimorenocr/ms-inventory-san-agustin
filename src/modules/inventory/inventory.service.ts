import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';
import { FIFOService } from './fifo/fifo.service';
import { ConsumeProductoSalidaDto } from './dto/consume-product.dto';
import { DescontarProductoSalidaDto } from './dto/descontar-producto-salida.dto';
import { ReservaParaCombosDto } from './dto/reserva-para-combos.dto';
import { ValidateStockDto } from './dto/validate-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private fifo: FIFOService,
  ) { }

  /**
   * Descuenta un ProductoSalida (combo) del inventario
   * Usa FIFO para seleccionar automáticamente de qué reserva descontar
   * 
   * @param productoSalidaId - ID del ProductoSalida (combo)
   * @param dto - Datos del descuento: cantidad (peso total), componentes opcionales, motivo
   */
  async descontarProductoSalidaCombo(
    productoSalidaId: number,
    dto: DescontarProductoSalidaDto,
  ) {
    console.log('\n🟠 ========== DESCUENTO DE COMBO ==========');
    console.log(`📦 ProductoSalidaId: ${productoSalidaId}`);
    console.log(`⚖️  Cantidad (peso total): ${dto.cantidad} kg`);
    console.log(`📝 Motivo: ${dto.motivo || 'N/A'}`);

    // Obtener el ProductoSalida con sus componentes
    const productoSalida = await this.prisma.productoSalida.findUnique({
      where: { id: productoSalidaId },
      include: {
        componentes: true,
        componentesIndividual: true,
      },
    });

    if (!productoSalida) {
      throw new BadRequestException(`ProductoSalida ${productoSalidaId} no encontrado`);
    }

    console.log(`✅ Producto encontrado: "${productoSalida.nombre}"`);

    // Normalizadores componentes especificados si los hay
    let componentesParaDescontar = [];
    if (dto.componentes && dto.componentes.length > 0) {
      console.log(`📋 Usando ${dto.componentes.length} componentes ESPECIFICADOS`);
      componentesParaDescontar = dto.componentes;
    } else {
      // Si no hay componentes especificados, usar FIFO para asignar automáticamente
      console.log(`🔄 Asignando componentes automáticamente con FIFO...`);
      componentesParaDescontar = await this.fifo.asignarComponentesConFIFO(
        productoSalidaId,
        dto.cantidad,
      );
    }

    console.log(`📦 Componentes a descontar: ${componentesParaDescontar.length}`);
    componentesParaDescontar.forEach((c, i) => {
      console.log(`   ${i + 1}. BaseId: ${c.baseId} | Peso: ${c.peso.toFixed(3)} kg`);
    });

    // Usar el FIFO service para hacer el descuento real
    const resultado = await this.fifo.descontarProductoSalida(
      productoSalidaId,
      dto.cantidad,
      dto.ventaId,
      componentesParaDescontar,
    );

    console.log('🟠 ========== FIN DESCUENTO DE COMBO ==========\n');

    return resultado;
  }

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

  /**
   * Reserva cantidad de un SubparteBase para combos
   * Actualiza reservaCombosKg
   * 
   * @param subparteBaseId - ID del SubparteBase a reservar
   * @param dto - Cantidad a reservar y motivo
   */
  async reservarSubparteParaCombos(
    subparteBaseId: number,
    dto: ReservaParaCombosDto,
  ) {
    console.log('\n🔵 ========== RESERVA SUBPARTE PARA COMBOS ==========');
    console.log(`📦 SubparteBaseId: ${subparteBaseId}`);
    console.log(`⚖️  Cantidad a reservar: ${dto.cantidad} kg`);
    console.log(`📝 Motivo: ${dto.motivo || 'N/A'}`);

    // Obtener el SubparteBase
    const subparte = await this.prisma.subparteBase.findUnique({
      where: { id: subparteBaseId },
    });

    if (!subparte) {
      throw new NotFoundException(`SubparteBase ${subparteBaseId} no encontrado`);
    }

    console.log(`✅ SubparteBase encontrado: "${subparte.nombre}"`);

    // Obtener inventario disponible
    const inventarioDisponible = await this.prisma.subparteLote.aggregate({
      where: {
        idSubparteBase: subparteBaseId,
        pesoSubparteKg: { gt: 0 },
      },
      _sum: { pesoSubparteKg: true },
    });

    const totalDisponible = Number(inventarioDisponible._sum.pesoSubparteKg || 0);
    const yaReservado = Number(subparte.reservaCombosKg || 0);
    const disponibleParaReservar = totalDisponible - yaReservado;

    console.log(`   📊 Inventario disponible: ${totalDisponible.toFixed(2)} kg`);
    console.log(`   🔒 Ya reservado: ${yaReservado.toFixed(2)} kg`);
    console.log(`   ✅ Disponible para reservar: ${disponibleParaReservar.toFixed(2)} kg`);

    if (disponibleParaReservar < dto.cantidad) {
      throw new BadRequestException(
        `No hay suficiente inventario para reservar. Requerido: ${dto.cantidad.toFixed(2)} kg, disponible: ${disponibleParaReservar.toFixed(2)} kg`,
      );
    }

    // Actualizar reservaCombosKg
    const subparteActualizado = await this.prisma.subparteBase.update({
      where: { id: subparteBaseId },
      data: {
        reservaCombosKg: {
          increment: dto.cantidad,
        },
      },
    });

    console.log(`   ✅ Reserva actualizada: ${subparteActualizado.reservaCombosKg.toFixed(2)} kg`);
    console.log('🔵 ========== FIN RESERVA ==========\n');

    return {
      success: true,
      subparteBaseId,
      nombre: subparte.nombre,
      cantidadReservada: dto.cantidad,
      nuevoTotalReservado: subparteActualizado.reservaCombosKg,
      inventarioTotal: totalDisponible,
      disponibleParaReservar: disponibleParaReservar - dto.cantidad,
    };
  }

  /**
   * Reserva cantidad de un ProductoBase para combos
   * Actualiza reservaCombosKg
   * 
   * @param productoBaseId - ID del ProductoBase a reservar
   * @param dto - Cantidad a reservar y motivo
   */
  async reservarProductoParaCombos(
    productoBaseId: number,
    dto: ReservaParaCombosDto,
  ) {
    console.log('\n🔵 ========== RESERVA PRODUCTO PARA COMBOS ==========');
    console.log(`📦 ProductoBaseId: ${productoBaseId}`);
    console.log(`⚖️  Cantidad a reservar: ${dto.cantidad} kg`);
    console.log(`📝 Motivo: ${dto.motivo || 'N/A'}`);

    // Obtener el ProductoBase
    const producto = await this.prisma.productoBase.findUnique({
      where: { id: productoBaseId },
    });

    if (!producto) {
      throw new NotFoundException(`ProductoBase ${productoBaseId} no encontrado`);
    }

    console.log(`✅ ProductoBase encontrado: "${producto.nombre}"`);

    // Obtener inventario disponible
    const inventarioDisponible = await this.prisma.loteIndividual.aggregate({
      where: {
        idProductoBase: productoBaseId,
        pesoKg: { gt: 0 },
      },
      _sum: { pesoKg: true },
    });

    const totalDisponible = Number(inventarioDisponible._sum.pesoKg || 0);
    const yaReservado = Number(producto.reservaCombosKg || 0);
    const disponibleParaReservar = totalDisponible - yaReservado;

    console.log(`   📊 Inventario disponible: ${totalDisponible.toFixed(2)} kg`);
    console.log(`   🔒 Ya reservado: ${yaReservado.toFixed(2)} kg`);
    console.log(`   ✅ Disponible para reservar: ${disponibleParaReservar.toFixed(2)} kg`);

    if (disponibleParaReservar < dto.cantidad) {
      throw new BadRequestException(
        `No hay suficiente inventario para reservar. Requerido: ${dto.cantidad.toFixed(2)} kg, disponible: ${disponibleParaReservar.toFixed(2)} kg`,
      );
    }

    // Actualizar reservaCombosKg
    const productoActualizado = await this.prisma.productoBase.update({
      where: { id: productoBaseId },
      data: {
        reservaCombosKg: {
          increment: dto.cantidad,
        },
      },
    });

    console.log(`   ✅ Reserva actualizada: ${productoActualizado.reservaCombosKg.toFixed(2)} kg`);
    console.log('🔵 ========== FIN RESERVA ==========\n');

    return {
      success: true,
      productoBaseId,
      nombre: producto.nombre,
      cantidadReservada: dto.cantidad,
      nuevoTotalReservado: productoActualizado.reservaCombosKg,
      inventarioTotal: totalDisponible,
      disponibleParaReservar: disponibleParaReservar - dto.cantidad,
    };
  }

  /**
   * Descuenta un combo directamente desde balanza
   * Solo recibe el peso total, el FIFO decide de qué componentes descontar
   * según disponibilidad (no importa el porcentaje)
   * 
   * @param productoSalidaId - ID del ProductoSalida (combo)
   * @param pesoTotal - Peso total medido por la balanza (kg)
   * @param motivo - Motivo del descuento
   * @param ventaId - ID de la venta (opcional)
   */
  async descontarComboDesdeBalanza(
    productoSalidaId: number,
    pesoTotal: number,
    motivo: string,
    ventaId?: number,
  ) {
    console.log('\n🟠 ========== DESCUENTO COMBO DESDE BALANZA ==========');
    console.log(`📦 ProductoSalidaId (Combo): ${productoSalidaId}`);
    console.log(`⚖️  Peso total (balanza): ${pesoTotal} kg`);
    console.log(`📝 Motivo: ${motivo}`);
    if (ventaId) console.log(`💳 VentaId: ${ventaId}`);

    // Obtener el combo y sus componentes
    const combo = await this.prisma.productoSalida.findUnique({
      where: { id: productoSalidaId },
      include: {
        componentes: {
          include: {
            subparteBase: true,
          },
        },
      },
    });

    if (!combo) {
      throw new NotFoundException(`ProductoSalida ${productoSalidaId} no encontrado`);
    }

    if (combo.componentes.length === 0) {
      throw new BadRequestException(
        `El combo "${combo.nombre}" no tiene componentes configurados`,
      );
    }

    console.log(`✅ Combo encontrado: "${combo.nombre}"`);
    console.log(`📋 Componentes del combo: ${combo.componentes.length}`);

    // Obtener disponibilidad por componente
    console.log('\n🔍 Verificando disponibilidad en reservas y stock físico...');
    const componentesConDisponibilidad = [];
    let totalDisponible = 0;

    for (const componente of combo.componentes) {
      const subparte = await this.prisma.subparteBase.findUnique({
        where: { id: componente.subparteBaseId },
      });

      // Disponible en reservas
      const disponibleReserva = Math.max(
        0,
        (subparte.reservaCombosKg || 0) - (subparte.consumidoCombosKg || 0),
      );

      // Disponible en stock físico (SubparteLote)
      const stockFisico = await this.prisma.subparteLote.aggregate({
        where: {
          idSubparteBase: componente.subparteBaseId,
          pesoSubparteKg: { gt: 0 },
        },
        _sum: { pesoSubparteKg: true },
      });
      const disponibleFisico = stockFisico._sum.pesoSubparteKg || 0;

      const totalDisponibleComponente = disponibleReserva + disponibleFisico;
      totalDisponible += totalDisponibleComponente;

      console.log(
        `   • ${componente.subparteBase.nombre} (ID: ${componente.subparteBaseId}): ` +
        `${totalDisponibleComponente.toFixed(2)} kg disponible ` +
        `(Reserva: ${disponibleReserva.toFixed(2)} + Físico: ${disponibleFisico.toFixed(2)})`
      );

      componentesConDisponibilidad.push({
        baseId: componente.subparteBaseId,
        nombre: componente.subparteBase.nombre,
        disponible: totalDisponibleComponente,
      });
    }

    console.log(`\n📊 Total disponible en componentes: ${totalDisponible.toFixed(2)} kg`);
    console.log(`⚖️  Peso requerido: ${pesoTotal.toFixed(2)} kg`);

    if (totalDisponible < pesoTotal) {
      throw new BadRequestException(
        `Stock insuficiente para el combo. Disponible: ${totalDisponible.toFixed(2)} kg, Requerido: ${pesoTotal.toFixed(2)} kg`
      );
    }

    // Distribuir el peso entre componentes disponibles (FIFO simple)
    console.log('\n🔄 Distribuyendo peso entre componentes disponibles (FIFO)...');
    const componentesParaDescontar = [];
    let pesoRestante = pesoTotal;

    for (const componente of componentesConDisponibilidad) {
      if (pesoRestante <= 0) break;

      const pesoADescontar = Math.min(pesoRestante, componente.disponible);
      
      console.log(
        `   Descontando ${pesoADescontar.toFixed(3)} kg de ${componente.nombre}`
      );

      componentesParaDescontar.push({
        baseId: componente.baseId,
        peso: pesoADescontar,
      });

      pesoRestante -= pesoADescontar;
    }

    console.log(`\n✅ Distribución FIFO completada`);

    // Usar el método de FIFO para descontar
    const resultado = await this.fifo.descontarProductoSalida(
      productoSalidaId,
      pesoTotal,
      ventaId,
      componentesParaDescontar,
    );

    console.log('🟠 ========== FIN DESCUENTO DESDE BALANZA ==========\n');
    
    return resultado;
  }
}
