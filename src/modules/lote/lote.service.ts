import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { LoteRepository } from './repository/lote.repository';
import { PrismaService } from '../../infraestructure/prisma/prisma.service';

@Injectable()
export class LoteService {
  constructor(
    private readonly repository: LoteRepository,
    private readonly prisma: PrismaService,
  ) {}

  // ======================================================
  // 📌 CREAR LOTE + CREAR CATEGORIAS Y SUBPARTES AUTOMATICAMENTE
  // ======================================================
  async create(createLoteDto: CreateLoteDto) {
    const lote = await this.repository.create(createLoteDto);

    const categoriasBase = await this.prisma.categoriaBase.findMany({
      where: {
        tipoAnimal: createLoteDto.tipoAnimal,
        estado: true,
      },
      include: { subpartes: { where: { estado: true } } },
    });

    for (const categoriaBase of categoriasBase) {
      const categoriaLote = await this.prisma.categoriaLote.create({
        data: {
          idLote: lote.id,
          idCategoriaBase: categoriaBase.id,
          pesoCategoriaKg: 0,
        },
      });

      for (const subparteBase of categoriaBase.subpartes) {
        await this.prisma.subparteLote.create({
          data: {
            idLote: lote.id,
            idCategoriaLote: categoriaLote.id,
            idSubparteBase: subparteBase.id,
            pesoSubparteKg: 0,
          },
        });
      }
    }

    return this.findOne(lote.id);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    const lote = await this.repository.findOne(id);
    if (!lote) throw new NotFoundException(`Lote con ID ${id} no encontrado`);
    return lote;
  }

  findByTipoAnimal(tipoAnimal: string) {
    return this.repository.findByTipoAnimal(tipoAnimal);
  }

  findByTipoIngreso(tipoIngreso: string) {
    return this.repository.findByTipoIngreso(tipoIngreso);
  }

  findByProveedorId(proveedorId: number) {
    return this.repository.findByProveedorId(proveedorId);
  }

  async update(id: number, updateLoteDto: UpdateLoteDto) {
    await this.findOne(id);
    return this.repository.update(id, updateLoteDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  // ======================================================
  // 📌 REPORTE: TOTAL GENERAL DE CARNE
  // ======================================================
  async getTotalCarne() {
    const { _sum: subpartes } = await this.prisma.subparteLote.aggregate({
      _sum: { pesoSubparteKg: true },
    });

    const { _sum: individuales } = await this.prisma.loteIndividual.aggregate({
      _sum: { pesoKg: true },
    });

    const totalSub = Number(subpartes.pesoSubparteKg ?? 0);
    const totalInd = Number(individuales.pesoKg ?? 0);

    return {
      totalSubpartesKg: totalSub,
      totalIndividualesKg: totalInd,
      totalCarneKg: totalSub + totalInd,
    };
  }

  // ======================================================
  // 📌 REPORTE: TOTAL POR TIPO DE ANIMAL
  // ======================================================
  async getTotalCarnePorTipo() {
    const tipos = ['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'];

    const resultados: Record<
      string,
      { totalSubpartesKg: number; totalIndividualesKg: number; totalCarneKg: number }
    > = {};

    for (const tipo of tipos) {
      const { _sum: subpartes } = await this.prisma.subparteLote.aggregate({
        _sum: { pesoSubparteKg: true },
        where: { lote: { tipoAnimal: tipo } },
      });

      const { _sum: individuales } = await this.prisma.loteIndividual.aggregate({
        _sum: { pesoKg: true },
        where: { lote: { tipoAnimal: tipo } },
      });

      const totalSub = Number(subpartes.pesoSubparteKg ?? 0);
      const totalInd = Number(individuales.pesoKg ?? 0);

      resultados[tipo] = {
        totalSubpartesKg: totalSub,
        totalIndividualesKg: totalInd,
        totalCarneKg: totalSub + totalInd,
      };
    }

    // Total general de todos los tipos
    const totalGeneralSub = Object.values(resultados).reduce(
      (acc, r) => acc + r.totalSubpartesKg,
      0,
    );

    const totalGeneralInd = Object.values(resultados).reduce(
      (acc, r) => acc + r.totalIndividualesKg,
      0,
    );

    return {
      porTipoAnimal: resultados,
      totalGeneral: {
        totalSubpartesKg: totalGeneralSub,
        totalIndividualesKg: totalGeneralInd,
        totalCarneKg: totalGeneralSub + totalGeneralInd,
      },
    };
  }

  // ======================================================
  // 📌 REPORTE: TOTAL POR CADA SUBPARTE
  // ======================================================
  async getTotalPorSubparte() {
    const subpartes = await this.prisma.subparteLote.groupBy({
      by: ['idSubparteBase'],
      _sum: {
        pesoSubparteKg: true,
      },
    });

    const resultado = [];

    for (const subparte of subpartes) {
      const subparteBase = await this.prisma.subparteBase.findUnique({
        where: { id: subparte.idSubparteBase },
        include: {
          categoria: true,
        },
      });

      resultado.push({
        idSubparteBase: subparte.idSubparteBase,
        nombreSubparte: subparteBase?.nombre || 'Desconocida',
        categoria: subparteBase?.categoria.nombre || 'Sin categoría',
        tipoAnimal: subparteBase?.categoria.tipoAnimal || 'Sin tipo',
        totalKg: Number(subparte._sum.pesoSubparteKg ?? 0),
      });
    }

    // Ordenar por total descendente
    resultado.sort((a, b) => b.totalKg - a.totalKg);

    const totalGeneral = resultado.reduce((acc, item) => acc + item.totalKg, 0);

    return {
      subpartes: resultado,
      totalGeneral: totalGeneral,
    };
  }
}
