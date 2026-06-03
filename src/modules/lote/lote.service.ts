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
  ) { }

  // ======================================================
  // 📌 CREAR LOTE + CREAR CATEGORIAS Y SUBPARTES AUTOMATICAMENTE
  // ======================================================
  async create(createLoteDto: CreateLoteDto, user: any) {
    // Validar que el usuario existe y tiene ID
    if (!user || !user.sub) {
      throw new Error('Usuario no autenticado o sin ID');
    }

    console.log("👤 Usuario autenticado:", user);
    console.log("📦 DTO recibido:", createLoteDto);

    // Crear lote con ID del usuario autenticado
    const loteData = {
      ...createLoteDto,
      idUsuario: user.sub,
    };

    console.log("💾 Datos a guardar en BD:", loteData);

    // 1. Crear el lote principal
    const lote = await this.repository.create(loteData as CreateLoteDto);

    // 2. Obtener la estructura base para clonar (categorías y subpartes)
    const categoriasBase = await this.prisma.categoriaBase.findMany({
      where: {
        tipoAnimal: createLoteDto.tipoAnimal,
        estado: true,
      },
      include: { subpartes: { where: { estado: true } } },
    });

    // 3. Crear categorías y subpartes en paralelo
    // Usamos Promise.all para disparar la creación de cada categoría simultáneamente
    await Promise.all(
      categoriasBase.map(async (categoriaBase) => {
        // a. Crear la Categoría Lote
        const categoriaLote = await this.prisma.categoriaLote.create({
          data: {
            idLote: lote.id,
            idCategoriaBase: categoriaBase.id,
            pesoCategoriaKg: 0,
          },
        });

        // b. Crear todas las subpartes de esta categoría en una sola operación (bulk insert)
        if (categoriaBase.subpartes.length > 0) {
          await this.prisma.subparteLote.createMany({
            data: categoriaBase.subpartes.map((subparteBase) => ({
              idLote: lote.id,
              idCategoriaLote: categoriaLote.id,
              idSubparteBase: subparteBase.id,
              pesoSubparteKg: 0,
            })),
          });
        }
      })
    );

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

    if (subpartes.length === 0) {
        return { subpartes: [], totalGeneral: 0 };
    }

    const subparteIds = subpartes.map(s => s.idSubparteBase);
    const subpartesBases = await this.prisma.subparteBase.findMany({
        where: { id: { in: subparteIds } },
        include: { categoria: true },
    });

    const subparteMap = new Map(subpartesBases.map(s => [s.id, s]));
    const resultado = [];

    for (const subparte of subpartes) {
      const subparteBase = subparteMap.get(subparte.idSubparteBase);

      resultado.push({
        idSubparteBase: subparte.idSubparteBase,
        nombreSubparte: subparteBase?.nombre || 'Desconocida',
        categoria: subparteBase?.categoria?.nombre || 'Sin categoría',
        tipoAnimal: subparteBase?.categoria?.tipoAnimal || 'Sin tipo',
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

  // ======================================================
  // 📌 REPORTE: TOTAL POR CADA PRODUCTO BASE
  // ======================================================
  async getTotalPorProductoBase() {
    const productos = await this.prisma.loteIndividual.groupBy({
      by: ['idProductoBase'],
      _sum: {
        pesoKg: true,
      },
    });

    if (productos.length === 0) {
        return { productos: [], totalGeneral: 0 };
    }

    const productoIds = productos.map(p => p.idProductoBase);
    const productosBases = await this.prisma.productoBase.findMany({
        where: { id: { in: productoIds } }
    });

    const productoMap = new Map(productosBases.map(p => [p.id, p]));
    const resultado = [];

    for (const producto of productos) {
      const productoBase = productoMap.get(producto.idProductoBase);

      resultado.push({
        id: producto.idProductoBase,
        nombre: productoBase?.nombre || 'Desconocido',
        totalKg: Number(producto._sum.pesoKg ?? 0),
      });
    }

    // Ordenar por total descendente
    resultado.sort((a, b) => b.totalKg - a.totalKg);

    const totalGeneral = resultado.reduce((acc, item) => acc + item.totalKg, 0);

    return {
      productos: resultado,
      totalGeneral: totalGeneral,
    };
  }
}
