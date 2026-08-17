import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaLocalService } from '../../../infraestructure/prisma/prisma-local.service';

// Tipo para la "bolsa lógica de stock"
interface ItemStock {
  origen: 'SUBPARTE_LOTE' | 'LOTE_INDIVIDUAL';
  id: number;
  baseId: number;
  pesoDisponible: number;
  fecha: Date;
}

@Injectable()
export class FIFOService {
  constructor(private prisma: PrismaLocalService) { }

  /**
   * Asigna automáticamente componentes a un combo usando FIFO sobre reservas
   * Determina cuánto peso de cada componente es necesario basándose en los factores de asignación
   * Luego busca esas cantidades en las reservas disponibles (reservaCombosKg)
   * 
   * @param productoSalidaId - ID del ProductoSalida (combo)
   * @param pesoTotal - Peso total del combo a vender
   * @returns Array de componentes con sus pesos asignados
   */
  async asignarComponentesConFIFO(
    productoSalidaId: number,
    pesoTotal: number,
  ): Promise<Array<{ baseId: number; peso: number }>> {
    console.log(`\n🔄 Asignando componentes con FIFO para ProductoSalidaId: ${productoSalidaId}`);
    console.log(`   Peso total: ${pesoTotal} kg`);

    // Obtener la configuración del combo (componentes y factores de asignación)
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

    // Construir lista de componentes con su factor de asignación
    const componentesConfig = [
      ...(productoSalida.componentes || []).map((c: any) => ({
        baseId: c.subparteBaseId,
        factor: Number(c.factorAsignacion || 0),
        tipoBase: 'SUBPARTE',
      })),
      ...(productoSalida.componentesIndividual || []).map((c: any) => ({
        baseId: c.productoBaseId,
        factor: Number(c.factorAsignacion || 0),
        tipoBase: 'PRODUCTO_BASE',
      })),
    ];

    if (componentesConfig.length === 0) {
      throw new BadRequestException('El combo no tiene componentes configurados');
    }

    // Calcular pesos necesarios de cada componente basándose en factores
    const hayFactores = componentesConfig.some((c) => c.factor > 0);
    const totalFactor = hayFactores
      ? componentesConfig.reduce((sum, c) => sum + (c.factor > 0 ? c.factor : 0), 0)
      : componentesConfig.length;

    if (totalFactor <= 0) {
      throw new BadRequestException('La configuración de factores no es válida');
    }

    console.log(`   Componentes configurados: ${componentesConfig.length}`);
    console.log(`   Total factor: ${totalFactor}`);

    // Calcular peso de cada componente
    let componentesPeso = [] as Array<{ baseId: number; peso: number; tipoBase: string }>;
    let acumulado = 0;

    for (let i = 0; i < componentesConfig.length; i++) {
      const componente = componentesConfig[i];
      const esUltimo = i === componentesConfig.length - 1;

      let peso: number;
      if (esUltimo) {
        // Último componente: asignar el peso restante
        peso = Math.max(0, pesoTotal - acumulado);
      } else {
        const factor = hayFactores
          ? componente.factor > 0
            ? componente.factor
            : 0
          : 1;
        peso = Number(((factor / totalFactor) * pesoTotal).toFixed(3));
      }

      if (peso > 0) {
        componentesPeso.push({
          baseId: componente.baseId,
          peso,
          tipoBase: componente.tipoBase,
        });
        acumulado += peso;
      }

      console.log(`   ${i + 1}. BaseId ${componente.baseId} (${componente.tipoBase}): ${peso.toFixed(3)} kg`);
    }

    // Verificar disponibilidad - primero en reservas, luego en inventario real
    console.log(`\n   🔍 Verificando disponibilidad...`);
    
    for (const comp of componentesPeso) {
      let disponibleEnReserva = 0;
      let disponibleEnInventario = 0;

      if (comp.tipoBase === 'SUBPARTE') {
        // Verificar reserva
        const subparte = await this.prisma.subparteBase.findUnique({
          where: { id: comp.baseId },
          select: { reservaCombosKg: true, consumidoCombosKg: true },
        });
        disponibleEnReserva = Math.max(0, Number(subparte?.reservaCombosKg || 0) - Number(subparte?.consumidoCombosKg || 0));

        // Si no hay en reserva, verificar en inventario real (SubparteLote)
        if (disponibleEnReserva < comp.peso) {
          const inventarioReal = await this.prisma.subparteLote.aggregate({
            where: { idSubparteBase: comp.baseId, pesoSubparteKg: { gt: 0 } },
            _sum: { pesoSubparteKg: true },
          });
          disponibleEnInventario = Number(inventarioReal._sum.pesoSubparteKg || 0);
        }
      } else {
        // Verificar reserva
        const producto = await this.prisma.productoBase.findUnique({
          where: { id: comp.baseId },
          select: { reservaCombosKg: true, consumidoCombosKg: true },
        });
        disponibleEnReserva = Math.max(0, Number(producto?.reservaCombosKg || 0) - Number(producto?.consumidoCombosKg || 0));

        // Si no hay en reserva, verificar en inventario real (LoteIndividual)
        if (disponibleEnReserva < comp.peso) {
          const inventarioReal = await this.prisma.loteIndividual.aggregate({
            where: { idProductoBase: comp.baseId, pesoKg: { gt: 0 } },
            _sum: { pesoKg: true },
          });
          disponibleEnInventario = Number(inventarioReal._sum.pesoKg || 0);
        }
      }

      const totalDisponible = disponibleEnReserva + disponibleEnInventario;

      if (totalDisponible < comp.peso) {
        throw new BadRequestException(
          `Stock insuficiente para BaseId ${comp.baseId}. Requerido: ${comp.peso.toFixed(2)} kg, disponible: ${totalDisponible.toFixed(2)} kg (Reserva: ${disponibleEnReserva.toFixed(2)} kg, Inventario: ${disponibleEnInventario.toFixed(2)} kg)`,
        );
      }

      console.log(`      BaseId ${comp.baseId}: ${comp.peso.toFixed(3)} kg ✅`);
      if (disponibleEnReserva > 0) {
        console.log(`         └─ Reserva: ${disponibleEnReserva.toFixed(3)} kg`);
      }
      if (disponibleEnInventario > 0) {
        console.log(`         └─ Inventario: ${disponibleEnInventario.toFixed(3)} kg`);
      }
    }

    console.log(`   ✅ Asignación FIFO completada\n`);
    return componentesPeso.map((c) => ({ baseId: c.baseId, peso: c.peso }));
  }

  /**
   * Descuenta un ProductoSalida del inventario usando FIFO
   * CON COMPONENTES ESPECIFICADOS: El cliente define exactamente cuánto descontar de cada componente
   * 
   * @param productoSalidaId - ID del ProductoSalida
   * @param pesoNecesario - Peso TOTAL (para validación)
   * @param referenciaId - ID de la venta (para auditoría)
   * @param componentes - Array con [{ baseId, peso }, ...] especificados por el cliente
   */
  async descontarProductoSalida(
    productoSalidaId: number,
    pesoNecesario: number,
    referenciaId?: number,
    componentes?: Array<{ baseId: number; peso: number }>,
    unidades?: number,
  ) {
    console.log('\n🔵 ========== INICIO DESCUENTO DE INVENTARIO ==========');
    console.log(`📦 ProductoSalidaId: ${productoSalidaId}`);
    console.log(`⚖️  Peso Necesario TOTAL: ${pesoNecesario} kg`);
    console.log(`🔗 Referencia Venta ID: ${referenciaId || 'N/A'}`);

    // 1️⃣ Definir QUÉ se puede consumir (no cuánto)
    console.log('\n1️⃣ Buscando componentes del producto...');
    const productoSalida = await this.prisma.productoSalida.findUnique({
      where: { id: productoSalidaId },
      include: {
        componentes: true, // SubparteBase IDs
        componentesIndividual: true, // ProductoBase IDs
      },
    });

    if (!productoSalida) {
      throw new BadRequestException('Producto de salida no encontrado');
    }

    console.log(`✅ Producto: "${productoSalida.nombre}"`);

    const componentesManuales = this.normalizarComponentesEntrada(componentes as any[]);
    const tieneComponentesEspecificados = componentesManuales.length > 0;
    const componentesParaDescuento =
      componentesManuales.length > 0
        ? componentesManuales
        : await this.construirComponentesAutomaticos(productoSalida, pesoNecesario);

    if (tieneComponentesEspecificados) {
      console.log(`\n📋 Componentes ESPECIFICADOS (cliente define pesos exactos):`);
    } else {
      console.log(`\n📋 Componentes AUTOMATICOS (configurados por combo en BD):`);
    }

    componentesParaDescuento.forEach((c, i) => {
      console.log(`   ${i + 1}. BaseId: ${c.baseId} | Peso: ${c.peso.toFixed(3)} kg`);
    });

    const sumaPesos = componentesParaDescuento.reduce((sum, c) => sum + c.peso, 0);
    console.log(`   ✅ Suma total: ${sumaPesos.toFixed(3)} kg`);

    let totalDescontado = 0;
    let totalItemsDescontados = 0;
    let unidadesPorDescontar = unidades || 0;

    console.log('\n2️⃣ Descontando inventario con componentes resueltos...');

    for (const componente of componentesParaDescuento) {
      const { baseId, peso } = componente;
      const tipoBase = (componente as any).tipoBase as 'SUBPARTE' | 'PRODUCTO_BASE' | undefined;
      const aplicaReserva = Boolean((componente as any).aplicaReserva);
      console.log(`\n   🔄 Procesando BaseId: ${baseId} | Peso a descontar: ${peso.toFixed(3)} kg`);

      const descontado = await this.descontarBaseConPrioridad(
        baseId,
        peso,
        referenciaId,
        tipoBase,
        unidadesPorDescontar,
      );
      // Consume units so they are only deducted from the first base component processed
      unidadesPorDescontar = 0;

      if (descontado + 0.0001 < peso) {
        throw new BadRequestException(
          `Stock insuficiente para BaseId ${baseId}. Faltan ${(peso - descontado).toFixed(2)} kg`,
        );
      }

      totalDescontado += descontado;
      totalItemsDescontados++;

      if (aplicaReserva && tipoBase === 'SUBPARTE') {
        await this.prisma.subparteBase.update({
          where: { id: baseId },
          data: { consumidoCombosKg: { increment: descontado } },
        });
      }

      if (aplicaReserva && tipoBase === 'PRODUCTO_BASE') {
        await this.prisma.productoBase.update({
          where: { id: baseId },
          data: { consumidoCombosKg: { increment: descontado } },
        });
      }

      console.log(`         ✅ Descontado. Total componente: ${descontado.toFixed(3)} kg`);
    }

    // 5️⃣ Validación final
    console.log('\n5️⃣ Validación final...');
    console.log(`   ✅ DESCUENTO EXITOSO`);
    console.log(`   Total descontado: ${totalDescontado.toFixed(3)} kg`);
    console.log(`   Items procesados: ${totalItemsDescontados}`);
    console.log('🔵 ========== FIN DESCUENTO DE INVENTARIO ==========\n');

    return {
      success: true,
      pesoDescontado: totalDescontado,
      productoNombre: productoSalida.nombre,
      itemsDescontados: totalItemsDescontados,
    };

  }

  private normalizarComponentesEntrada(componentes?: any[]) {
    if (!componentes || componentes.length === 0) {
      return [] as Array<{ baseId: number; peso: number }>;
    }

    return componentes
      .map((componente) => {
        const baseId = Number(
          componente?.baseId ?? componente?.subparteBaseId ?? componente?.baseProductId,
        );
        const peso = Number(componente?.peso ?? componente?.pesoComponenteKg ?? componente?.weight);

        if (!Number.isFinite(baseId) || baseId <= 0 || !Number.isFinite(peso) || peso <= 0) {
          return null;
        }

        return { baseId, peso };
      })
      .filter((item): item is { baseId: number; peso: number } => item !== null);
  }

  private async construirComponentesAutomaticos(productoSalida: any, pesoNecesario: number) {
    const porReserva = await this.construirComponentesDesdeReservaGlobal(productoSalida, pesoNecesario);
    if (porReserva.length > 0) {
      return porReserva;
    }

    const componentesSubparte = (productoSalida.componentes || []).map((c: any) => ({
      baseId: c.subparteBaseId,
      factorAsignacion: Number(c.factorAsignacion || 0),
    }));

    const componentesIndividual = (productoSalida.componentesIndividual || []).map((c: any) => ({
      baseId: c.productoBaseId,
      factorAsignacion: Number(c.factorAsignacion || 0),
    }));

    const componentes = [...componentesSubparte, ...componentesIndividual];

    if (componentes.length === 0) {
      throw new BadRequestException('El producto de salida no tiene componentes definidos');
    }

    const hayFactores = componentes.some((c) => c.factorAsignacion > 0);
    const totalFactor = hayFactores
      ? componentes.reduce((sum, c) => sum + (c.factorAsignacion > 0 ? c.factorAsignacion : 0), 0)
      : componentes.length;

    if (totalFactor <= 0) {
      throw new BadRequestException(
        'La configuracion de factores de asignacion no es valida para este producto',
      );
    }

    let acumulado = 0;
    const resultado = componentes.map((componente, index) => {
      const esUltimo = index === componentes.length - 1;
      if (esUltimo) {
        const restante = Number((pesoNecesario - acumulado).toFixed(3));
        return {
          baseId: componente.baseId,
          peso: restante > 0 ? restante : 0,
        };
      }

      const factor = hayFactores
        ? componente.factorAsignacion > 0
          ? componente.factorAsignacion
          : 0
        : 1;

      const peso = Number(((factor / totalFactor) * pesoNecesario).toFixed(3));
      acumulado += peso;

      return {
        baseId: componente.baseId,
        peso,
      };
    });

    return resultado.filter((c) => c.peso > 0);
  }

  private async construirComponentesDesdeReservaGlobal(productoSalida: any, pesoNecesario: number) {
    const subparteIds = (productoSalida.componentes || []).map((c: any) => c.subparteBaseId);
    const productoBaseIds = (productoSalida.componentesIndividual || []).map(
      (c: any) => c.productoBaseId,
    );

    // Si no es un combo (tiene 1 o menos componentes), no aplica reserva global
    if (subparteIds.length + productoBaseIds.length <= 1) {
      return [] as Array<{ baseId: number; peso: number; tipoBase: 'SUBPARTE' | 'PRODUCTO_BASE'; aplicaReserva: boolean }>;
    }

    const [subpartes, productosBase] = await Promise.all([
      subparteIds.length
        ? this.prisma.subparteBase.findMany({
            where: { id: { in: subparteIds }, estado: true },
            select: { id: true, reservaCombosKg: true, consumidoCombosKg: true },
          })
        : Promise.resolve([]),
      productoBaseIds.length
        ? this.prisma.productoBase.findMany({
            where: { id: { in: productoBaseIds }, estado: true },
            select: { id: true, reservaCombosKg: true, consumidoCombosKg: true },
          })
        : Promise.resolve([]),
    ]);

    const candidatos = [
      ...subpartes.map((s) => ({
        baseId: s.id,
        tipoBase: 'SUBPARTE' as const,
        disponible: Math.max(0, Number(s.reservaCombosKg || 0) - Number(s.consumidoCombosKg || 0)),
      })),
      ...productosBase.map((p) => ({
        baseId: p.id,
        tipoBase: 'PRODUCTO_BASE' as const,
        disponible: Math.max(0, Number(p.reservaCombosKg || 0) - Number(p.consumidoCombosKg || 0)),
      })),
    ].filter((c) => c.disponible > 0);

    if (candidatos.length === 0) {
      return [];
    }

    const totalDisponibleReserva = candidatos.reduce((sum, c) => sum + c.disponible, 0);
    if (totalDisponibleReserva + 0.0001 < pesoNecesario) {
      throw new BadRequestException(
        `Reserva global para combos insuficiente. Requerido ${pesoNecesario.toFixed(2)} kg, disponible ${totalDisponibleReserva.toFixed(2)} kg`,
      );
    }

    let restante = pesoNecesario;
    const componentes = [] as Array<{
      baseId: number;
      peso: number;
      tipoBase: 'SUBPARTE' | 'PRODUCTO_BASE';
      aplicaReserva: boolean;
    }>;

    for (const candidato of candidatos) {
      if (restante <= 0) {
        break;
      }

      const peso = Number(Math.min(candidato.disponible, restante).toFixed(3));
      if (peso <= 0) {
        continue;
      }

      componentes.push({
        baseId: candidato.baseId,
        peso,
        tipoBase: candidato.tipoBase,
        aplicaReserva: true,
      });

      restante = Number((restante - peso).toFixed(3));
    }

    return componentes;
  }

  private async descontarBaseConPrioridad(
    baseId: number,
    peso: number,
    referenciaId?: number,
    tipoBase?: 'SUBPARTE' | 'PRODUCTO_BASE',
    unidades?: number,
  ) {
    let restante = peso;
    let total = 0;

    const consumirSubparte = async () => {
      const subpartesLote = await this.prisma.subparteLote.findMany({
        where: {
          idSubparteBase: baseId,
          pesoSubparteKg: { gt: 0 },
        },
        orderBy: { fechaPesado: 'asc' },
      });

      for (const subparte of subpartesLote) {
        if (restante <= 0) break;

        const consumir = Math.min(subparte.pesoSubparteKg, restante);

        await this.prisma.subparteLote.update({
          where: { id: subparte.id },
          data: { pesoSubparteKg: { decrement: consumir } },
        });

        await this.prisma.movimientoInventario.create({
          data: {
            tipo: 'VENTA',
            referenciaId,
            subparteLoteId: subparte.id,
            subparteBaseId: baseId,
            peso: consumir,
          },
        });

        restante -= consumir;
        total += consumir;
      }
    };

    const consumirIndividual = async () => {
      const lotesIndividual = await this.prisma.loteIndividual.findMany({
        where: {
          idProductoBase: baseId,
          pesoKg: { gt: 0 },
        },
        orderBy: { fechaRegistro: 'asc' },
      });

      let unidadesADescontar = unidades || 0;

      for (const lote of lotesIndividual) {
        if (restante <= 0) break;

        const consumir = Math.min(lote.pesoKg, restante);

        const updateData: any = { pesoKg: { decrement: consumir } };
        if (unidadesADescontar > 0) {
          console.log(`      🔢 Descontando ${unidadesADescontar} unidades de LoteIndividual ID: ${lote.idLote}`);
          updateData.unidades = { decrement: unidadesADescontar };
          unidadesADescontar = 0; // Solo descontar una vez
        }

        await this.prisma.loteIndividual.update({
          where: { idLote: lote.idLote },
          data: updateData,
        });

        restante -= consumir;
        total += consumir;
      }
    };

    if (tipoBase === 'PRODUCTO_BASE') {
      await consumirIndividual();
      if (restante > 0) {
        await consumirSubparte();
      }
    } else {
      await consumirSubparte();
      if (restante > 0) {
        await consumirIndividual();
      }
    }

    return total;
  }

  /**
   * Descuenta para INTERCAMBIO DE PRODUCTO
   * Recibe componentes con [{ baseId, peso }, ...] del cliente
   * @param productoSalidaId ID del producto
   * @param componentes Array [{ baseId, peso }, ...] especificados por cliente
   * @param referenciaId ID de referencia (venta)
   */
  async descontarIntercambio(
    productoSalidaId: number,
    componentes: Array<{ baseId: number; peso: number }>,
    referenciaId?: number,
  ) {
    console.log('\n🟢 ========== DESCUENTO PARA INTERCAMBIO ==========');
    console.log(`📦 ProductoSalidaId: ${productoSalidaId}`);
    console.log(`📋 Componentes recibidos (${componentes.length}):`);
    componentes.forEach((c) => {
      console.log(`   - BaseId: ${c.baseId} | Peso: ${c.peso} kg`);
    });

    // Validar que haya componentes
    if (!componentes || componentes.length === 0) {
      throw new BadRequestException('Se requieren componentes para el intercambio');
    }

    // Validar que la suma de pesos sea correcta (cliente ya validó esto en venta.service)
    const sumaPesos = componentes.reduce((sum, c) => sum + c.peso, 0);
    console.log(`   ✅ Suma total: ${sumaPesos.toFixed(3)} kg`);

    // Obtener producto
    const productoSalida = await this.prisma.productoSalida.findUnique({
      where: { id: productoSalidaId },
    });

    if (!productoSalida) {
      throw new BadRequestException('Producto de salida no encontrado');
    }

    console.log(`✅ Producto: "${productoSalida.nombre}"`);

    let totalDescontado = 0;
    let totalItemsDescontados = 0;

    // Procesar cada componente con su peso ESPECÍFICO
    for (const componente of componentes) {
      const { baseId, peso } = componente;
      console.log(`\n🔹 Procesando BaseId: ${baseId} | Peso: ${peso.toFixed(3)} kg`);

      let restante = peso;

      // 1️⃣ Buscar en SubparteLote (desposte)
      const subpartesLote = await this.prisma.subparteLote.findMany({
        where: {
          idSubparteBase: baseId,
          pesoSubparteKg: { gt: 0 },
        },
        orderBy: { fechaPesado: 'asc' }, // FIFO
      });

      if (subpartesLote.length > 0) {
        console.log(`   📍 SubparteLote: ${subpartesLote.length} lote(s)`);

        for (const subparte of subpartesLote) {
          if (restante <= 0) break;

          const consumir = Math.min(subparte.pesoSubparteKg, restante);
          console.log(`   🔄 Descontando ${consumir.toFixed(3)} kg de SubparteLote ID: ${subparte.id}`);

          await this.prisma.subparteLote.update({
            where: { id: subparte.id },
            data: { pesoSubparteKg: { decrement: consumir } },
          });

          await this.prisma.movimientoInventario.create({
            data: {
              tipo: 'INTERCAMBIO',
              referenciaId,
              subparteLoteId: subparte.id,
              subparteBaseId: baseId,
              peso: consumir,
            },
          });

          restante -= consumir;
          totalDescontado += consumir;
          totalItemsDescontados++;
          console.log(`      ✅ Restante: ${restante.toFixed(3)} kg`);
        }
      }

      // 2️⃣ Buscar en LoteIndividual si hay restante
      if (restante > 0) {
        const lotesIndividual = await this.prisma.loteIndividual.findMany({
          where: {
            idProductoBase: baseId,
            pesoKg: { gt: 0 },
          },
          orderBy: { fechaRegistro: 'asc' }, // FIFO
        });

        if (lotesIndividual.length > 0) {
          console.log(`   📍 LoteIndividual: ${lotesIndividual.length} lote(s)`);

          for (const lote of lotesIndividual) {
            if (restante <= 0) break;

            const consumir = Math.min(lote.pesoKg, restante);
            console.log(`   🔄 Descontando ${consumir.toFixed(3)} kg de LoteIndividual ID: ${lote.idLote}`);

            await this.prisma.loteIndividual.update({
              where: { idLote: lote.idLote },
              data: { pesoKg: { decrement: consumir } },
            });

            restante -= consumir;
            totalDescontado += consumir;
            totalItemsDescontados++;
            console.log(`      ✅ Restante: ${restante.toFixed(3)} kg`);
          }
        }
      }

      // Validar que se descargó completamente
      if (restante > 0) {
        throw new BadRequestException(
          `Stock insuficiente para BaseId ${baseId}. Faltan ${restante.toFixed(2)} kg`,
        );
      }
    }

    console.log('\n✅ DESCUENTO PARA INTERCAMBIO EXITOSO');
    console.log(`   Total descontado: ${totalDescontado.toFixed(3)} kg`);
    console.log(`   Items procesados: ${totalItemsDescontados}`);
    console.log('🟢 ========== FIN DESCUENTO INTERCAMBIO ==========\n');

    return {
      success: true,
      pesoDescontado: totalDescontado,
      productoNombre: productoSalida.nombre,
      itemsDescontados: totalItemsDescontados,
    };
  }

  /**
   * Descuenta inventario usando componentes individuales con pesos específicos
   * Este método recibe los pesos exactos desde el frontend (POS)
   * @param productoSalidaId ID del producto
   * @param componentes Array de componentes con weight y baseProductId/type
   * @param referenciaId ID de referencia (venta)
   */
  async descontarPorComponentes(
    productoSalidaId: number,
    componentes: any[],
    referenciaId?: number,
  ) {
    console.log('\n🟣 ========== DESCUENTO POR COMPONENTES INDIVIDUALES ==========');
    console.log(`📦 ProductoSalidaId: ${productoSalidaId}`);
    console.log(`📋 Componentes recibidos: ${componentes.length}`);

    // Obtener info del producto
    const productoSalida = await this.prisma.productoSalida.findUnique({
      where: { id: productoSalidaId },
    });

    if (!productoSalida) {
      throw new BadRequestException('Producto de salida no encontrado');
    }

    console.log(`✅ Producto: "${productoSalida.nombre}"`);

    let totalDescontado = 0;
    let totalItemsDescontados = 0;

    // Procesar cada componente con su peso específico
    for (const componente of componentes) {
      console.log(`\n🔍 DEBUG - Componente recibido:`, JSON.stringify(componente, null, 2));

      // Soportar ambos formatos:
      // Formato nuevo (desde VentaComponentePeso): { subparteBaseId, pesoComponenteKg }
      // Formato antiguo (legacy): { baseProductId, weight, type, name }
      const pesoKg = componente.pesoComponenteKg || componente.weight;
      const baseProductId = componente.subparteBaseId || componente.baseProductId;
      const componentName = componente.name || 'Componente';
      const componentType = componente.type; // 'producto_base' o 'subparte' (solo en formato antiguo)

      console.log(`\n🔹 Procesando componente: ${componentName}`);
      console.log(`   BaseProductId: ${baseProductId}`);
      console.log(`   Tipo: ${componentType || 'no especificado'}`);
      console.log(`   Peso requerido: ${pesoKg.toFixed(3)} kg`);

      let restante = pesoKg;

      // Decidir dónde buscar según el tipo de componente
      if (componentType === 'producto_base') {
        // ============ COMPONENTE TIPO PRODUCTO_BASE ============
        // Solo buscar en LoteIndividual (compras individuales)
        console.log(`   📌 Componente tipo producto_base, buscando SOLO en LoteIndividual`);

        const lotesIndividual = await this.prisma.loteIndividual.findMany({
          where: {
            idProductoBase: baseProductId,
            pesoKg: { gt: 0 },
          },
          orderBy: { fechaRegistro: 'asc' }, // FIFO
        });

        if (lotesIndividual.length > 0) {
          console.log(`   🛒 LoteIndividual encontrado: ${lotesIndividual.length} lote(s)`);

          for (const lote of lotesIndividual) {
            if (restante <= 0) break;

            const consumir = Math.min(lote.pesoKg, restante);

            console.log(`      🔄 Descontando ${consumir.toFixed(3)} kg de LoteIndividual ID: ${lote.idLote}`);

            await this.prisma.loteIndividual.update({
              where: { idLote: lote.idLote },
              data: { pesoKg: { decrement: consumir } },
            });

            // TODO: Crear MovimientoInventarioIndividual

            restante -= consumir;
            totalDescontado += consumir;
            totalItemsDescontados++;

            console.log(`         ✅ Descontado. Restante: ${restante.toFixed(3)} kg`);
          }
        } else {
          console.log(`   ⚠️  No se encontró stock en LoteIndividual para ProductoBase ID: ${baseProductId}`);
        }
      } else {
        // ============ COMPONENTE TIPO SUBPARTE (o no especificado) ============
        // PASO 1: Buscar primero en SubparteLote (desposte)
        console.log(`   📌 Componente tipo subparte, buscando en SubparteLote`);

        const subpartesLote = await this.prisma.subparteLote.findMany({
          where: {
            idSubparteBase: baseProductId,
            pesoSubparteKg: { gt: 0 },
          },
          orderBy: { fechaPesado: 'asc' }, // FIFO
        });

        if (subpartesLote.length > 0) {
          console.log(`   🥩 SubparteLote encontrado: ${subpartesLote.length} lote(s)`);

          for (const subparte of subpartesLote) {
            if (restante <= 0) break;

            const consumir = Math.min(subparte.pesoSubparteKg, restante);

            console.log(`      🔄 Descontando ${consumir.toFixed(3)} kg de SubparteLote ID: ${subparte.id}`);

            await this.prisma.subparteLote.update({
              where: { id: subparte.id },
              data: { pesoSubparteKg: { decrement: consumir } },
            });

            await this.prisma.movimientoInventario.create({
              data: {
                tipo: 'VENTA',
                referenciaId,
                subparteLoteId: subparte.id,
                subparteBaseId: baseProductId,
                peso: consumir,
              },
            });

            restante -= consumir;
            totalDescontado += consumir;
            totalItemsDescontados++;

            console.log(`         ✅ Descontado. Restante: ${restante.toFixed(3)} kg`);
          }
        }

        // PASO 2: Si aún falta peso, buscar en LoteIndividual (compras individuales)
        if (restante > 0) {
          console.log(`   📌 Buscando en LoteIndividual como fallback`);

          // Buscar ProductoBase con el mismo nombre que el SubparteBase
          const subparteBase = await this.prisma.subparteBase.findUnique({
            where: { id: baseProductId },
          });

          if (subparteBase) {
            // Buscar ProductoBase con el mismo nombre
            const productoBase = await this.prisma.productoBase.findFirst({
              where: {
                nombre: {
                  equals: subparteBase.nombre,
                },
              },
            });

            if (productoBase) {
              console.log(`   📌 Encontrado ProductoBase ID: ${productoBase.id} con nombre: ${productoBase.nombre}`);

              const lotesIndividual = await this.prisma.loteIndividual.findMany({
                where: {
                  idProductoBase: productoBase.id,
                  pesoKg: { gt: 0 },
                },
                orderBy: { fechaRegistro: 'asc' }, // FIFO
              });

              if (lotesIndividual.length > 0) {
                console.log(`   🛒 LoteIndividual encontrado: ${lotesIndividual.length} lote(s)`);

                for (const lote of lotesIndividual) {
                  if (restante <= 0) break;

                  const consumir = Math.min(lote.pesoKg, restante);

                  console.log(`      🔄 Descontando ${consumir.toFixed(3)} kg de LoteIndividual ID: ${lote.idLote}`);

                  await this.prisma.loteIndividual.update({
                    where: { idLote: lote.idLote },
                    data: { pesoKg: { decrement: consumir } },
                  });

                  // TODO: Crear MovimientoInventarioIndividual

                  restante -= consumir;
                  totalDescontado += consumir;
                  totalItemsDescontados++;

                  console.log(`         ✅ Descontado. Restante: ${restante.toFixed(3)} kg`);
                }
              } else {
                console.log(`   ⚠️  No se encontró stock en LoteIndividual para ProductoBase ID: ${productoBase.id}`);
              }
            }
          }
        }
      }

      // PASO 3: Validar que se descontó todo el peso requerido
      if (restante > 0) {
        throw new BadRequestException(
          `Stock insuficiente para ${componentName}. Faltan ${restante.toFixed(2)} kg`,
        );
      }
    }

    console.log('\n✅ DESCUENTO POR COMPONENTES EXITOSO');
    console.log(`   Total descontado: ${totalDescontado.toFixed(3)} kg`);
    console.log(`   Items procesados: ${totalItemsDescontados}`);
    console.log('🟣 ========== FIN DESCUENTO POR COMPONENTES ==========\n');

    return {
      success: true,
      pesoDescontado: totalDescontado,
      productoNombre: productoSalida.nombre,
      itemsDescontados: totalItemsDescontados,
    };
  }

  /**
   * Método legacy para compatibilidad
   * @deprecated Usar descontarProductoSalida en su lugar
   */
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
      throw new BadRequestException('Stock insuficiente para la subparte');
    }
  }

  /**
   * Reintegra inventario para un ProductoSalida (por devolución)
   * Suma el peso devuelto a los lotes más recientes (LIFO inverso)
   */
  async reintegrarProductoSalida(
    productoSalidaId: number,
    pesoDevuelto: number,
    referenciaId?: number,
  ) {
    console.log('\n🟡 ========== REINTEGRO DE INVENTARIO (DEVOLUCIÓN) ==========');
    console.log(`📦 ProductoSalidaId: ${productoSalidaId}`);
    console.log(`⚖️  Peso a Reintegrar: ${pesoDevuelto} kg`);
    console.log(`🔗 Referencia (Devolución) ID: ${referenciaId || 'N/A'}`);

    // Obtener componentes del producto
    const productoSalida = await this.prisma.productoSalida.findUnique({
      where: { id: productoSalidaId },
      include: {
        componentes: true,
        componentesIndividual: true,
      },
    });

    if (!productoSalida) {
      throw new BadRequestException('Producto de salida no encontrado');
    }

    console.log(`✅ Producto: "${productoSalida.nombre}"`);

    const subparteBaseIds = productoSalida.componentes.map(
      (c) => c.subparteBaseId,
    );
    const productoBaseIds = productoSalida.componentesIndividual.map(
      (c) => c.productoBaseId,
    );

    const totalComponentes = subparteBaseIds.length + productoBaseIds.length;
    const pesoPorComponente = pesoDevuelto / totalComponentes;

    console.log(`\n📊 Distribuyendo peso entre componentes:`);
    console.log(`   Total componentes: ${totalComponentes}`);
    console.log(`   Peso por componente: ${pesoPorComponente.toFixed(3)} kg`);

    const movimientos = [];
    let totalReintegrado = 0;

    // Reintegrar a SubparteLote (más recientes primero - LIFO)
    if (subparteBaseIds.length > 0) {
      console.log(`\n🟡 Reintegrando a SubparteLote...`);

      for (const subparteBaseId of subparteBaseIds) {
        console.log(`\n   🥩 Procesando SubparteBase ID: ${subparteBaseId}`);
        console.log(`      Peso a reintegrar: ${pesoPorComponente.toFixed(3)} kg`);

        // Obtener el lote más reciente de este SubparteBase
        const loteReciente = await this.prisma.subparteLote.findFirst({
          where: {
            idSubparteBase: subparteBaseId,
          },
          orderBy: { fechaPesado: 'desc' },
        });

        if (loteReciente) {
          // Actualizar el peso del lote más reciente
          const nuevoLote = await this.prisma.subparteLote.update({
            where: { id: loteReciente.id },
            data: {
              pesoSubparteKg: {
                increment: pesoPorComponente,
              },
            },
          });

          console.log(`      ✅ Reintegrado al lote ${loteReciente.id}`);
          console.log(`         Peso anterior: ${loteReciente.pesoSubparteKg} kg`);
          console.log(`         Peso nuevo: ${nuevoLote.pesoSubparteKg} kg`);

          totalReintegrado += pesoPorComponente;

          // Registrar movimiento
          movimientos.push({
            tipo: 'DEVOLUCION',
            subparteLoteId: loteReciente.id,
            subparteBaseId,
            peso: pesoPorComponente,
          });
        } else {
          // Si no hay lote existente, lanzar error
          console.log(`      ❌ No hay lote existente para SubparteBase ID: ${subparteBaseId}`);
          throw new BadRequestException(
            `No se puede reintegrar: no existe un lote para la subparte ID ${subparteBaseId}. ` +
            `El producto debe haber sido vendido previamente para poder reintegrar stock.`
          );
        }
      }
    }

    // Reintegrar a LoteIndividual (más recientes primero - LIFO)
    if (productoBaseIds.length > 0) {
      console.log(`\n🟡 Reintegrando a LoteIndividual...`);

      for (const productoBaseId of productoBaseIds) {
        console.log(`\n   📦 Procesando ProductoBase ID: ${productoBaseId}`);
        console.log(`      Peso a reintegrar: ${pesoPorComponente.toFixed(3)} kg`);

        // Obtener el lote más reciente de este ProductoBase
        const loteReciente = await this.prisma.loteIndividual.findFirst({
          where: {
            idProductoBase: productoBaseId,
          },
          orderBy: { fechaRegistro: 'desc' },
        });

        if (loteReciente) {
          // Actualizar el peso del lote más reciente
          const nuevoLote = await this.prisma.loteIndividual.update({
            where: { idLote: loteReciente.idLote },
            data: {
              pesoKg: {
                increment: pesoPorComponente,
              },
            },
          });

          console.log(`      ✅ Reintegrado al lote ${loteReciente.idLote}`);
          console.log(`         Peso anterior: ${loteReciente.pesoKg} kg`);
          console.log(`         Peso nuevo: ${nuevoLote.pesoKg} kg`);

          totalReintegrado += pesoPorComponente;

          movimientos.push({
            tipo: 'DEVOLUCION',
            loteIndividualId: loteReciente.idLote,
            productoBaseId,
            peso: pesoPorComponente,
          });
        } else {
          // Si no hay lote existente, lanzar error
          console.log(`      ❌ No hay lote existente para ProductoBase ID: ${productoBaseId}`);
          throw new BadRequestException(
            `No se puede reintegrar: no existe un lote para el producto base ID ${productoBaseId}. ` +
            `El producto debe haber sido vendido previamente para poder reintegrar stock.`
          );
        }
      }
    }

    // Registrar movimientos en BD (solo para SubparteLote)
    // TODO: Crear tabla MovimientoInventarioIndividual para LoteIndividual
    for (const mov of movimientos) {
      // Solo registrar movimientos de SubparteLote
      if (mov.subparteLoteId) {
        await this.prisma.movimientoInventario.create({
          data: {
            tipo: 'DEVOLUCION',
            referenciaId,
            subparteLoteId: mov.subparteLoteId,
            subparteBaseId: mov.subparteBaseId,
            peso: mov.peso,
          },
        });
      } else {
        console.log(`      ⚠️  Movimiento de LoteIndividual no registrado (TODO: crear tabla)`);
      }
    }

    console.log(`\n✅ Reintegro completado`);
    console.log(`   Total reintegrado: ${totalReintegrado.toFixed(3)} kg`);
    console.log('🟡 ========== FIN REINTEGRO ==========\n');

    return {
      success: true,
      message: 'Inventario reintegrado correctamente',
      totalReintegrado,
      movimientos: movimientos.length,
    };
  }

  /**
   * Reintegra inventario para INTERCAMBIO con pesos específicos
   * Recibe: [{ baseId, peso }, ...]
   */
  async reintegrarIntercambio(
    productoSalidaId: number,
    componentes: Array<{ baseId: number; peso: number }>,
    referenciaId?: number,
  ) {
    console.log('\n🟢 ========== REINTEGRO PARA INTERCAMBIO ==========');
    console.log(`📦 ProductoSalidaId: ${productoSalidaId}`);
    console.log(`📋 Componentes a reintegrar (${componentes.length}):`);
    componentes.forEach((c) => {
      console.log(`   - BaseId: ${c.baseId} | Peso: ${c.peso} kg`);
    });

    if (!componentes || componentes.length === 0) {
      throw new BadRequestException('Se requieren componentes para reintegro');
    }

    const productoSalida = await this.prisma.productoSalida.findUnique({
      where: { id: productoSalidaId },
    });

    if (!productoSalida) {
      throw new BadRequestException('Producto de salida no encontrado');
    }

    console.log(`✅ Producto: "${productoSalida.nombre}"`);

    let totalReintegrado = 0;
    const movimientos: any[] = [];

    // Procesar cada componente con su peso específico
    for (const componente of componentes) {
      const { baseId, peso } = componente;
      console.log(`\n🔹 Reintegrando BaseId: ${baseId} | Peso: ${peso.toFixed(3)} kg`);

      // 1️⃣ Buscar SubparteLote más reciente
      const subparteMasReciente = await this.prisma.subparteLote.findFirst({
        where: {
          idSubparteBase: baseId,
        },
        orderBy: { fechaPesado: 'desc' },
      });

      if (subparteMasReciente) {
        console.log(`   🥩 Reintegrando en SubparteLote ID: ${subparteMasReciente.id}`);
        const nuevoSubparte = await this.prisma.subparteLote.update({
          where: { id: subparteMasReciente.id },
          data: { pesoSubparteKg: { increment: peso } },
        });

        await this.prisma.movimientoInventario.create({
          data: {
            tipo: 'INTERCAMBIO',
            referenciaId,
            subparteLoteId: subparteMasReciente.id,
            subparteBaseId: baseId,
            peso: peso,
          },
        });

        totalReintegrado += peso;
        console.log(`      ✅ Reintegrado: ${peso.toFixed(3)} kg`);
      } else {
        // 2️⃣ Si no hay SubparteLote, buscar LoteIndividual
        const loteMasReciente = await this.prisma.loteIndividual.findFirst({
          where: {
            idProductoBase: baseId,
          },
          orderBy: { fechaRegistro: 'desc' },
        });

        if (loteMasReciente) {
          console.log(`   🛒 Reintegrando en LoteIndividual ID: ${loteMasReciente.idLote}`);
          const nuevoLote = await this.prisma.loteIndividual.update({
            where: { idLote: loteMasReciente.idLote },
            data: { pesoKg: { increment: peso } },
          });

          totalReintegrado += peso;
          console.log(`      ✅ Reintegrado: ${peso.toFixed(3)} kg`);
        } else {
          // Si no hay lote existente, lanzar error
          console.log(`   ❌ No hay lote existente para BaseId: ${baseId}`);
          throw new BadRequestException(
            `No se puede reintegrar: no existe un lote para el base ID ${baseId}. ` +
            `El producto debe haber sido vendido previamente para poder reintegrar stock.`
          );
        }
      }
    }

    console.log(`\n✅ Reintegro para intercambio completado`);
    console.log(`   Total reintegrado: ${totalReintegrado.toFixed(3)} kg`);
    console.log('🟢 ========== FIN REINTEGRO INTERCAMBIO ==========\n');

    return {
      success: true,
      message: 'Inventario reintegrado para intercambio',
      totalReintegrado,
    };
  }
}
