import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ProductoSalidaRepository } from './repository/producto-salida.repository';
import { CreateProductoSalidaDto } from './dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from './dto/update-producto-salida.dto';
import { AddComponenteSubparteDto } from './dto/add-componente-subparte.dto';
import { AddComponenteLoteDto } from './dto/add-componente-lote.dto';
import { AddComponenteSubparteLoteDto } from './dto/add-componente-subparte-lote.dto';
import { AddComponenteIndividualDto } from './dto/add-componente-individual.dto';

@Injectable()
export class ProductoSalidaService {
  private readonly logger = new Logger(ProductoSalidaService.name);

  constructor(private readonly repository: ProductoSalidaRepository) { }

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

  /**
   * Descontar stock del producto (para ventas)
   * @param productoSalidaId ID del producto
   * @param cantidad Cantidad a descontar (kg u otra unidad)
   * @param motivo Motivo del descuento
   */
  async descontarStock(productoSalidaId: number, cantidad: number, motivo: string = 'Venta realizada') {
    this.logger.log(`🔄 Iniciando proceso de descuento de stock para ProductoID: ${productoSalidaId}, Cantidad: ${cantidad}`);

    const producto = await this.findOne(productoSalidaId);

    if (!producto) {
      this.logger.error(`❌ Producto Salida con ID ${productoSalidaId} no encontrado`);
      throw new NotFoundException(`Producto Salida con ID ${productoSalidaId} no encontrado`);
    }

    this.logger.log(`✅ Producto encontrado: ${producto.nombre}`);

    if (cantidad <= 0) {
      this.logger.warn(`⚠️ Intento de descontar cantidad inválida: ${cantidad}`);
      throw new BadRequestException('La cantidad a descontar debe ser mayor a 0');
    }

    // LOGS DE DEBUGGEO
    this.logger.debug(`🔍 Analizando componentes del producto para descontar inventario...`);
    // TODO: Implementar lógica de búsqueda de lotes/subpartesDisponibles (FIFO)

    this.logger.warn(`⚠️ ATENCIÓN: La lógica de persistencia en DB para actualizar stock NO está implementada aún. Solo se está registrando el evento.`);

    this.logger.log(
      `✅ [SIMULACIÓN] Stock descontado: ${cantidad}kg del producto "${producto.nombre}" (Motivo: ${motivo})`,
    );

    return {
      mensaje: 'Stock descontado exitosamente (Simulado - Lógica pendiente)',
      productoId: productoSalidaId,
      productoNombre: producto.nombre,
      cantidadDescontada: cantidad,
      motivo,
      timestamp: new Date(),
      status: 'SIMULATED'
    };
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
}
