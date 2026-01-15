import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/prisma/prisma.service';

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
  constructor(private prisma: PrismaService) { }

  /**
   * Descuenta inventario para un ProductoSalida siguiendo el flujo completo:
   * 1. Identifica QUÉ se puede consumir (SubparteBase y ProductoBase)
   * 2. Divide el peso entre los componentes
   * 3. Para cada componente, busca stock y aplica FIFO
   * 4. Descuenta en cascada con FIFO por componente
   */
  async descontarProductoSalida(
    productoSalidaId: number,
    pesoNecesario: number,
    referenciaId?: number,
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

    // Extraer IDs válidos
    const subparteBaseIds = productoSalida.componentes.map(
      (c) => c.subparteBaseId,
    );
    const productoBaseIds = productoSalida.componentesIndividual.map(
      (c) => c.productoBaseId,
    );

    console.log(`   📋 SubparteBase IDs: [${subparteBaseIds.join(', ')}]`);
    console.log(`   📋 ProductoBase IDs: [${productoBaseIds.join(', ')}]`);

    if (subparteBaseIds.length === 0 && productoBaseIds.length === 0) {
      throw new BadRequestException(
        'El producto de salida no tiene componentes definidos',
      );
    }

    // 2️⃣ Calcular peso por componente
    const totalComponentes = subparteBaseIds.length + productoBaseIds.length;
    const pesoPorComponente = pesoNecesario / totalComponentes;

    console.log(`\n2️⃣ Dividiendo peso entre componentes:`);
    console.log(`   Total componentes: ${totalComponentes}`);
    console.log(`   Peso por componente: ${pesoPorComponente.toFixed(3)} kg`);

    let totalDescontado = 0;
    let totalItemsDescontados = 0;

    // 3️⃣ Descontar de SubparteLote (por cada SubparteBase)
    if (subparteBaseIds.length > 0) {
      console.log(`\n3️⃣ Descontando de SubparteLote...`);

      for (const subparteBaseId of subparteBaseIds) {
        console.log(`\n   🥩 Procesando SubparteBase ID: ${subparteBaseId}`);
        console.log(`      Peso a descontar: ${pesoPorComponente.toFixed(3)} kg`);

        // Buscar stock disponible para este SubparteBase específico
        const subpartesLote = await this.prisma.subparteLote.findMany({
          where: {
            idSubparteBase: subparteBaseId,
            pesoSubparteKg: { gt: 0 },
          },
          orderBy: { fechaPesado: 'asc' }, // FIFO
        });

        console.log(`      Stock encontrado: ${subpartesLote.length} lote(s)`);
        subpartesLote.forEach((s, i) => {
          console.log(`         ${i + 1}. ID: ${s.id} | Peso: ${s.pesoSubparteKg} kg | Fecha: ${s.fechaPesado.toISOString()}`);
        });

        // Aplicar FIFO para este componente
        let restante = pesoPorComponente;
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
              subparteBaseId: subparteBaseId,
              peso: consumir,
            },
          });

          restante -= consumir;
          totalDescontado += consumir;
          totalItemsDescontados++;

          console.log(`         ✅ Descontado. Restante: ${restante.toFixed(3)} kg`);
        }

        if (restante > 0) {
          throw new BadRequestException(
            `Stock insuficiente para SubparteBase ID ${subparteBaseId}. Faltan ${restante.toFixed(2)} kg`,
          );
        }
      }
    }

    // 4️⃣ Descontar de LoteIndividual (por cada ProductoBase)
    if (productoBaseIds.length > 0) {
      console.log(`\n4️⃣ Descontando de LoteIndividual...`);

      for (const productoBaseId of productoBaseIds) {
        console.log(`\n   🛒 Procesando ProductoBase ID: ${productoBaseId}`);
        console.log(`      Peso a descontar: ${pesoPorComponente.toFixed(3)} kg`);

        // Buscar stock disponible para este ProductoBase específico
        const lotesIndividual = await this.prisma.loteIndividual.findMany({
          where: {
            idProductoBase: productoBaseId,
            pesoKg: { gt: 0 },
          },
          orderBy: { fechaRegistro: 'asc' }, // FIFO
        });

        console.log(`      Stock encontrado: ${lotesIndividual.length} lote(s)`);
        lotesIndividual.forEach((l, i) => {
          console.log(`         ${i + 1}. ID: ${l.idLote} | Peso: ${l.pesoKg} kg | Fecha: ${l.fechaRegistro.toISOString()}`);
        });

        // Aplicar FIFO para este componente
        let restante = pesoPorComponente;
        for (const lote of lotesIndividual) {
          if (restante <= 0) break;

          const consumir = Math.min(lote.pesoKg, restante);

          console.log(`      🔄 Descontando ${consumir.toFixed(3)} kg de LoteIndividual ID: ${lote.idLote}`);

          await this.prisma.loteIndividual.update({
            where: { idLote: lote.idLote },
            data: { pesoKg: { decrement: consumir } },
          });

          restante -= consumir;
          totalDescontado += consumir;
          totalItemsDescontados++;

          console.log(`         ✅ Descontado. Restante: ${restante.toFixed(3)} kg`);
          console.log(`         ⚠️  Movimiento NO registrado (TODO: crear tabla MovimientoInventarioIndividual)`);
        }

        if (restante > 0) {
          throw new BadRequestException(
            `Stock insuficiente para ProductoBase ID ${productoBaseId}. Faltan ${restante.toFixed(2)} kg`,
          );
        }
      }
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

      // El POS ya envía el peso en kilogramos
      const pesoKg = componente.weight;
      const baseProductId = componente.baseProductId;
      const componentName = componente.name || 'Componente';

      console.log(`\n🔹 Procesando componente: ${componentName}`);
      console.log(`   BaseProductId: ${baseProductId}`);
      console.log(`   Peso requerido: ${pesoKg.toFixed(3)} kg`);

      let restante = pesoKg;

      // PASO 1: Buscar en SubparteLote (desposte)
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
                mode: 'insensitive',
              },
            },
          });

          if (productoBase) {
            const lotesIndividual = await this.prisma.loteIndividual.findMany({
              where: {
                idProductoBase: productoBase.id,
                pesoKg: { gt: 0 },
              },
              orderBy: { fechaRegistro: 'asc' }, // FIFO
            });

            if (lotesIndividual.length > 0) {
              console.log(`   🛒 LoteIndividual encontrado: ${lotesIndividual.length} lote(s) (ProductoBase ID: ${productoBase.id})`);

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
          // Si no hay lote, crear uno nuevo
          console.log(`      ⚠️  No hay lote existente, creando uno nuevo`);

          const nuevoLote = await this.prisma.subparteLote.create({
            data: {
              idSubparteBase: subparteBaseId,
              pesoSubparteKg: pesoPorComponente,
              fechaPesado: new Date(),
              idLote: 0, // Lote de reintegro
            },
          });

          console.log(`      ✅ Nuevo lote creado: ${nuevoLote.id}`);
          totalReintegrado += pesoPorComponente;

          movimientos.push({
            tipo: 'DEVOLUCION',
            subparteLoteId: nuevoLote.id,
            subparteBaseId,
            peso: pesoPorComponente,
          });
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
          orderBy: { fechaPesado: 'desc' },
        });

        if (loteReciente) {
          // Actualizar el peso del lote más reciente
          const nuevoLote = await this.prisma.loteIndividual.update({
            where: { id: loteReciente.id },
            data: {
              pesoKg: {
                increment: pesoPorComponente,
              },
            },
          });

          console.log(`      ✅ Reintegrado al lote ${loteReciente.id}`);
          console.log(`         Peso anterior: ${loteReciente.pesoKg} kg`);
          console.log(`         Peso nuevo: ${nuevoLote.pesoKg} kg`);

          totalReintegrado += pesoPorComponente;

          movimientos.push({
            tipo: 'DEVOLUCION',
            loteIndividualId: loteReciente.id,
            productoBaseId,
            peso: pesoPorComponente,
          });
        } else {
          // Si no hay lote, crear uno nuevo
          console.log(`      ⚠️  No hay lote existente, creando uno nuevo`);

          const nuevoLote = await this.prisma.loteIndividual.create({
            data: {
              idProductoBase: productoBaseId,
              pesoKg: pesoPorComponente,
              fechaPesado: new Date(),
              idLote: 0, // Lote de reintegro
            },
          });

          console.log(`      ✅ Nuevo lote creado: ${nuevoLote.id}`);
          totalReintegrado += pesoPorComponente;

          movimientos.push({
            tipo: 'DEVOLUCION',
            loteIndividualId: nuevoLote.id,
            productoBaseId,
            peso: pesoPorComponente,
          });
        }
      }
    }

    // Registrar movimientos en BD
    for (const mov of movimientos) {
      await this.prisma.movimientoInventario.create({
        data: {
          tipo: 'DEVOLUCION',
          referenciaId,
          ...mov,
        },
      });
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
}
