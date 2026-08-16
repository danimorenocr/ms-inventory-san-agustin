import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertaDto } from './dto/create-alert.dto';
import { UpdateAlertaDto } from './dto/update-alert.dto';
import { AlertRepository } from './repository/alert.repository';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(
    private readonly repository: AlertRepository,
    private readonly prisma: PrismaService,
  ) {}

  async checkRules() {
    try {
      // 1. Obtener todas las reglas de alerta activas
      const reglas = await this.prisma.alertaRegla.findMany({
        where: { activa: true },
      });

      for (const regla of reglas) {
        let targetName = '';

        // Identificar el nombre de la regla
        if (regla.subparteBaseId) {
          const sb = await this.prisma.subparteBase.findUnique({
            where: { id: regla.subparteBaseId },
          });
          targetName = sb?.nombre || '';
        } else if (regla.productoId) {
          const pb = await this.prisma.productoBase.findUnique({
            where: { id: regla.productoId },
          });
          targetName = pb?.nombre || '';
        }

        if (!targetName) continue;

        // 2. Obtener todas las subpartes y productos que comparten este nombre (case-insensitive)
        const matchingSubpartes = await this.prisma.subparteBase.findMany({
          where: { nombre: { equals: targetName, mode: 'insensitive' } },
        });
        const subparteIds = matchingSubpartes.map((s) => s.id);

        const matchingProductos = await this.prisma.productoBase.findMany({
          where: { nombre: { equals: targetName, mode: 'insensitive' } },
        });
        const productoIds = matchingProductos.map((p) => p.id);

        // 3. Calcular peso actual sumado
        const subparteSum = await this.prisma.subparteLote.aggregate({
          where: { idSubparteBase: { in: subparteIds }, pesoSubparteKg: { gt: 0 } },
          _sum: { pesoSubparteKg: true },
        });
        const subparteWeight = subparteSum._sum.pesoSubparteKg || 0;

        const individualSum = await this.prisma.loteIndividual.aggregate({
          where: { idProductoBase: { in: productoIds }, pesoKg: { gt: 0 } },
          _sum: { pesoKg: true },
        });
        const individualWeight = individualSum._sum.pesoKg || 0;

        const currentWeight = subparteWeight + individualWeight;

        let isTriggered = false;
        let initialWeight = 0;

        // 4. Evaluar según el tipo de condición
        if (regla.tipo === 'MINIMO_KG') {
          isTriggered = currentWeight <= regla.valor;
        } else if (regla.tipo === 'PORCENTAJE') {
          // Peso inicial de subpartes lote (actual + movimientos históricos de venta/merma/etc.)
          const activeSubpartesLote = await this.prisma.subparteLote.findMany({
            where: { idSubparteBase: { in: subparteIds } },
          });
          let subparteInitial = 0;
          for (const spl of activeSubpartesLote) {
            const movsSum = await this.prisma.movimientoInventario.aggregate({
              where: { subparteLoteId: spl.id },
              _sum: { peso: true },
            });
            const movementsWeight = movsSum._sum.peso || 0;
            subparteInitial += spl.pesoSubparteKg + movementsWeight;
          }

          // Peso inicial de lotes individuales
          const activeLotesIndividual = await this.prisma.loteIndividual.findMany({
            where: { idProductoBase: { in: productoIds } },
            include: { lote: true },
          });
          let individualInitial = 0;
          for (const li of activeLotesIndividual) {
            individualInitial += li.lote?.pesoKgInicial || li.pesoKg;
          }

          initialWeight = subparteInitial + individualInitial;
          const pct = initialWeight > 0 ? (currentWeight / initialWeight) * 100 : 0;
          isTriggered = pct <= regla.valor;
        } else if (regla.tipo === 'TIEMPO') {
          const oldestDateLimit = new Date();
          oldestDateLimit.setDate(oldestDateLimit.getDate() - regla.valor);

          const oldSubparte = await this.prisma.subparteLote.findFirst({
            where: {
              idSubparteBase: { in: subparteIds },
              pesoSubparteKg: { gt: 0 },
              fechaPesado: { lt: oldestDateLimit },
            },
          });

          const oldIndividual = await this.prisma.loteIndividual.findFirst({
            where: {
              idProductoBase: { in: productoIds },
              pesoKg: { gt: 0 },
              fechaRegistro: { lt: oldestDateLimit },
            },
          });

          isTriggered = !!oldSubparte || !!oldIndividual;
        }

        if (isTriggered) {
          // Generar mensaje descriptivo
          let mensaje = '';
          if (regla.tipo === 'MINIMO_KG') {
            mensaje = `Alerta de stock: El/La subparte/producto "${targetName}" tiene un peso total de ${currentWeight.toFixed(2)} kg, menor o igual al mínimo de ${regla.valor.toFixed(2)} kg.`;
          } else if (regla.tipo === 'PORCENTAJE') {
            const pct = initialWeight > 0 ? (currentWeight / initialWeight) * 100 : 0;
            mensaje = `Alerta de stock: El/La subparte/producto "${targetName}" está al ${pct.toFixed(1)}% de su peso inicial, menor o igual al límite de ${regla.valor}%.`;
          } else if (regla.tipo === 'TIEMPO') {
            mensaje = `Alerta de stock: El/La subparte/producto "${targetName}" tiene lotes activos con una antigüedad superior a ${regla.valor} días.`;
          }

          // Verificar si ya existe una alerta no leída con el mismo mensaje
          const existeAlerta = await this.prisma.alerta.findFirst({
            where: {
              mensaje,
              leida: false,
            },
          });

          if (!existeAlerta) {
            await this.prisma.alerta.create({
              data: {
                tipo: 'WARNING',
                mensaje,
                leida: false,
              },
            });
            console.log(`🔔 Alerta generada: ${mensaje}`);
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar reglas de alerta de stock:', error);
    }
  }

  async create(createAlertaDto: CreateAlertaDto) {
    return this.repository.create(createAlertaDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findUnread() {
    return this.repository.findUnread();
  }

  async findByTipo(tipo: string) {
    return this.repository.findByTipo(tipo);
  }

  async findOne(id: number) {
    const alert = await this.repository.findOne(id);
    if (!alert) {
      throw new NotFoundException(`Alerta con ID ${id} no encontrada`);
    }
    return alert;
  }

  async update(id: number, updateAlertaDto: UpdateAlertaDto) {
    await this.findOne(id);
    return this.repository.update(id, updateAlertaDto);
  }

  async markAsRead(id: number) {
    await this.findOne(id);
    return this.repository.markAsRead(id);
  }

  async markAllAsRead() {
    return this.repository.markAllAsRead();
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async removeAll() {
    return this.repository.removeAll();
  }
}

