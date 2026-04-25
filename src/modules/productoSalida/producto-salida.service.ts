import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ProductoSalidaRepository } from './repository/producto-salida.repository';
import { CreateProductoSalidaDto } from './dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from './dto/update-producto-salida.dto';
import { AddComponenteSubparteDto } from './dto/add-componente-subparte.dto';
import { AddComponenteLoteDto } from './dto/add-componente-lote.dto';
import { AddComponenteSubparteLoteDto } from './dto/add-componente-subparte-lote.dto';
import { AddComponenteIndividualDto } from './dto/add-componente-individual.dto';
import { FIFOService } from '../inventory/fifo/fifo.service';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';

@Injectable()
export class ProductoSalidaService {
  private readonly logger = new Logger(ProductoSalidaService.name);

  constructor(
    private readonly repository: ProductoSalidaRepository,
    private readonly fifoService: FIFOService,
    private readonly prisma: PrismaService,
  ) { }

  async create(createProductoSalidaDto: CreateProductoSalidaDto) {
    return this.repository.create(createProductoSalidaDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const producto = await this.repository.findOne(id);
    if (!producto) {
      throw new NotFoundException(`Producto Salida con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoSalidaDto: UpdateProductoSalidaDto) {
    await this.findOne(id); // Verificar que existe
    return this.repository.update(id, updateProductoSalidaDto);
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar que existe
    return this.repository.remove(id);
  }

  async actualizarPrecio(id: number, precio: number) {
    await this.findOne(id); // Verificar que existe
    return this.repository.actualizarPrecio(id, precio);
  }

  /**
   * Descontar stock del producto (para ventas)
   * Requiere componentes individuales con pesos específicos
   * @param productoSalidaId ID del producto
   * @param componentes Array de componentes con pesos individuales (REQUERIDO)
   * @param cantidad Cantidad total (solo para logging)
   * @param motivo Motivo del descuento
   */
  async descontarStock(
    productoSalidaId: number,
    componentes?: any[],
    cantidad?: number,
    motivo: string = 'Venta realizada',
  ) {
    this.logger.log(`🔄 Iniciando descuento REAL de stock para ProductoID: ${productoSalidaId}`);

    if (!cantidad || cantidad <= 0) {
      throw new BadRequestException('La cantidad total a descontar debe ser mayor a 0');
    }

    if (componentes && componentes.length > 0) {
      this.logger.log(`📋 Descuento con componentes individuales (${componentes.length} componentes)`);
    } else {
      this.logger.log('📋 No se enviaron componentes manuales. Se usará asignación automática del combo');
    }

    try {
      const resultado = await this.fifoService.descontarProductoSalida(
        productoSalidaId,
        cantidad,
        undefined,
        componentes,
      );

      this.logger.log(`✅ Stock descontado exitosamente`);

      return {
        mensaje: 'Stock descontado exitosamente',
        productoId: productoSalidaId,
        productoNombre: resultado.productoNombre,
        cantidadDescontada: resultado.pesoDescontado,
        itemsDescontados: resultado.itemsDescontados,
        motivo,
        timestamp: new Date(),
        status: 'SUCCESS'
      };
    } catch (error) {
      this.logger.error(`❌ Error al descontar stock por componentes: ${error.message}`);
      throw error;
    }
  }

  /**
   * Descuenta stock para un INTERCAMBIO de producto
   * Recibe componentes con pesos específicos: [{ baseId, peso }, ...]
   */
  async descontarIntercambio(
    productoSalidaId: number,
    componentes: Array<{ baseId: number; peso: number }>,
  ) {
    this.logger.log(`🔄 Intercambio - ProductoSalidaId: ${productoSalidaId}`);

    if (!componentes || componentes.length === 0) {
      throw new BadRequestException('Se requieren componentes para el intercambio');
    }

    try {
      const resultado = await this.fifoService.descontarIntercambio(
        productoSalidaId,
        componentes,
        undefined,
      );

      this.logger.log(`✅ Intercambio completado`);

      return {
        mensaje: 'Stock descontado para intercambio',
        productoId: productoSalidaId,
        productoNombre: resultado.productoNombre,
        cantidadDescontada: resultado.pesoDescontado,
        itemsDescontados: resultado.itemsDescontados,
        timestamp: new Date(),
        status: 'SUCCESS'
      };
    } catch (error) {
      this.logger.error(`❌ Error en intercambio: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reintegra stock para un INTERCAMBIO de producto
   * Recibe componentes con pesos específicos: [{ baseId, peso }, ...]
   */
  async reintegrarIntercambio(
    productoSalidaId: number,
    componentes: Array<{ baseId: number; peso: number }>,
  ) {
    this.logger.log(`🔄 Reintegro por intercambio - ProductoSalidaId: ${productoSalidaId}`);

    if (!componentes || componentes.length === 0) {
      throw new BadRequestException('Se requieren componentes para reintegro');
    }

    try {
      const resultado = await this.fifoService.reintegrarIntercambio(
        productoSalidaId,
        componentes,
        undefined,
      );

      this.logger.log(`✅ Reintegro para intercambio completado`);

      return {
        mensaje: 'Stock reintegrado para intercambio',
        productoId: productoSalidaId,
        cantidadReintegrada: resultado.totalReintegrado,
        timestamp: new Date(),
        status: 'SUCCESS'
      };
    } catch (error) {
      this.logger.error(`❌ Error en reintegro: ${error.message}`);
      throw error;
    }
  }

  // ========== COMPONENTES ==========
  async addComponenteSubparte(addComponenteSubparteDto: AddComponenteSubparteDto) {
    return this.repository.addComponenteSubparte(addComponenteSubparteDto);
  }

  async removeComponenteSubparte(
    productoSalidaId: number,
    subparteBaseId: number,
  ) {
    return this.repository.removeComponenteSubparte(
      productoSalidaId,
      subparteBaseId,
    );
  }

  /*
    async addComponenteLote(addComponenteLoteDto: AddComponenteLoteDto) {
      return this.repository.addComponenteLote(addComponenteLoteDto);
    }
  
    async removeComponenteLote(productoSalidaId: number, loteId: number) {
      return this.repository.removeComponenteLote(productoSalidaId, loteId);
    }
  
    async addComponenteSubparteLote(
      addComponenteSubparteLoteDto: AddComponenteSubparteLoteDto,
    ) {
      return this.repository.addComponenteSubparteLote(
        addComponenteSubparteLoteDto,
      );
    }
  
    async removeComponenteSubparteLote(
      productoSalidaId: number,
      subparteLoteId: number,
    ) {
      return this.repository.removeComponenteSubparteLote(
        productoSalidaId,
        subparteLoteId,
      );
    }
  */

  async addComponenteIndividual(
    addComponenteIndividualDto: AddComponenteIndividualDto,
  ) {
    return this.repository.addComponenteIndividual(addComponenteIndividualDto);
  }

  async removeComponenteIndividual(
    productoSalidaId: number,
    productoBaseId: number,
  ) {
    return this.repository.removeComponenteIndividual(
      productoSalidaId,
      productoBaseId,
    );
  }

  async getReporteReservasCombos(productoSalidaId?: number) {
    if (productoSalidaId !== undefined && (!Number.isFinite(productoSalidaId) || productoSalidaId <= 0)) {
      throw new BadRequestException('productoSalidaId debe ser un numero valido mayor a 0');
    }

    let productoSalida: any = null;
    let subparteIds: number[] = [];
    let productoBaseIds: number[] = [];

    if (productoSalidaId) {
      productoSalida = await this.prisma.productoSalida.findUnique({
        where: { id: productoSalidaId },
        include: {
          componentes: true,
          componentesIndividual: true,
        },
      });

      if (!productoSalida) {
        throw new NotFoundException(`Producto Salida con ID ${productoSalidaId} no encontrado`);
      }

      subparteIds = productoSalida.componentes.map((c) => c.subparteBaseId);
      productoBaseIds = productoSalida.componentesIndividual.map((c) => c.productoBaseId);
    }

    const [subpartes, productosBase, stockSubpartes, stockIndividual] = await Promise.all([
      this.prisma.subparteBase.findMany({
        where: productoSalidaId
          ? {
            id: { in: subparteIds.length > 0 ? subparteIds : [-1] },
          }
          : {
            OR: [
              { reservaCombosKg: { gt: 0 } },
              { consumidoCombosKg: { gt: 0 } },
            ],
          },
        select: {
          id: true,
          nombre: true,
          reservaCombosKg: true,
          consumidoCombosKg: true,
        },
      }),
      this.prisma.productoBase.findMany({
        where: productoSalidaId
          ? {
            id: { in: productoBaseIds.length > 0 ? productoBaseIds : [-1] },
          }
          : {
            OR: [
              { reservaCombosKg: { gt: 0 } },
              { consumidoCombosKg: { gt: 0 } },
            ],
          },
        select: {
          id: true,
          nombre: true,
          reservaCombosKg: true,
          consumidoCombosKg: true,
        },
      }),
      this.prisma.subparteLote.groupBy({
        by: ['idSubparteBase'],
        where: {
          pesoSubparteKg: { gt: 0 },
          ...(productoSalidaId && subparteIds.length > 0
            ? { idSubparteBase: { in: subparteIds } }
            : {}),
        },
        _sum: {
          pesoSubparteKg: true,
        },
      }),
      this.prisma.loteIndividual.groupBy({
        by: ['idProductoBase'],
        where: {
          pesoKg: { gt: 0 },
          ...(productoSalidaId && productoBaseIds.length > 0
            ? { idProductoBase: { in: productoBaseIds } }
            : {}),
        },
        _sum: {
          pesoKg: true,
        },
      }),
    ]);

    const stockSubpartesMap = new Map<number, number>(
      stockSubpartes.map((s) => [s.idSubparteBase, Number(s._sum.pesoSubparteKg || 0)]),
    );

    const stockIndividualMap = new Map<number, number>(
      stockIndividual.map((s) => [s.idProductoBase, Number(s._sum.pesoKg || 0)]),
    );

    const subpartesReporte = subpartes.map((item) => {
      const reservaKg = Number(item.reservaCombosKg || 0);
      const consumidoKg = Number(item.consumidoCombosKg || 0);
      return {
        tipoBase: 'subparte',
        baseId: item.id,
        nombre: item.nombre,
        reservaKg,
        consumidoKg,
        disponibleReservaKg: Math.max(0, reservaKg - consumidoKg),
        stockFisicoKg: Number(stockSubpartesMap.get(item.id) || 0),
      };
    });

    const productosBaseReporte = productosBase.map((item) => {
      const reservaKg = Number(item.reservaCombosKg || 0);
      const consumidoKg = Number(item.consumidoCombosKg || 0);
      return {
        tipoBase: 'producto_base',
        baseId: item.id,
        nombre: item.nombre,
        reservaKg,
        consumidoKg,
        disponibleReservaKg: Math.max(0, reservaKg - consumidoKg),
        stockFisicoKg: Number(stockIndividualMap.get(item.id) || 0),
      };
    });

    const items = [...subpartesReporte, ...productosBaseReporte];

    const resumen = items.reduce(
      (acc, item) => {
        acc.reservaTotalKg += item.reservaKg;
        acc.consumidoTotalKg += item.consumidoKg;
        acc.disponibleReservaTotalKg += item.disponibleReservaKg;
        acc.stockFisicoTotalKg += item.stockFisicoKg;
        return acc;
      },
      {
        reservaTotalKg: 0,
        consumidoTotalKg: 0,
        disponibleReservaTotalKg: 0,
        stockFisicoTotalKg: 0,
      },
    );

    return {
      productoSalida: productoSalida
        ? {
          id: productoSalida.id,
          nombre: productoSalida.nombre,
        }
        : null,
      totalBases: items.length,
      resumen,
      items,
    };
  }
}
