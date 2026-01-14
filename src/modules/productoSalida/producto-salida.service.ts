import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ProductoSalidaRepository } from './repository/producto-salida.repository';
import { CreateProductoSalidaDto } from './dto/create-producto-salida.dto';
import { UpdateProductoSalidaDto } from './dto/update-producto-salida.dto';
import { AddComponenteSubparteDto } from './dto/add-componente-subparte.dto';
import { AddComponenteLoteDto } from './dto/add-componente-lote.dto';
import { AddComponenteSubparteLoteDto } from './dto/add-componente-subparte-lote.dto';
import { AddComponenteIndividualDto } from './dto/add-componente-individual.dto';
import { FIFOService } from '../inventory/fifo/fifo.service';

@Injectable()
export class ProductoSalidaService {
  private readonly logger = new Logger(ProductoSalidaService.name);

  constructor(
    private readonly repository: ProductoSalidaRepository,
    private readonly fifoService: FIFOService,
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

    // Validar que vengan componentes
    if (!componentes || componentes.length === 0) {
      this.logger.error(`❌ No se proporcionaron componentes para el descuento`);
      throw new BadRequestException(
        'Debe proporcionar los componentes individuales con sus pesos específicos',
      );
    }

    this.logger.log(`📋 Descuento con componentes individuales (${componentes.length} componentes)`);

    try {
      const resultado = await this.fifoService.descontarPorComponentes(
        productoSalidaId,
        componentes,
        undefined,
      );

      this.logger.log(`✅ Stock descontado exitosamente por componentes`);

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
