import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de categorías, subpartes y datos de prueba...");

  // ============================================================
  // 1. Categorías Base
  // ============================================================
  const categoriasBase = [
    { id: 1, tipoAnimal: "res", nombre: "COGOTE" },
    { id: 2, tipoAnimal: "res", nombre: "BRAZOS" },
    { id: 3, tipoAnimal: "res", nombre: "PIERNAS" },
    { id: 4, tipoAnimal: "res", nombre: "COSTILLAS" },
    { id: 5, tipoAnimal: "res", nombre: "OTROS" },
    { id: 6, tipoAnimal: "res", nombre: "VISCERAS" },
  ];

  await prisma.categoriaBase.createMany({
    data: categoriasBase,
    skipDuplicates: true,
  });

  console.log("✔ Categorías base insertadas.");

  // ============================================================
  // 2. Subpartes Base (completo)
  // ============================================================
  const subpartesBase = [
    { idCategoriaBase: 1, nombre: "Tapa de cogote" },
    { idCategoriaBase: 1, nombre: "Descargue" },
    { idCategoriaBase: 1, nombre: "Cogote" },
    { idCategoriaBase: 1, nombre: "Chatas" },
    { idCategoriaBase: 1, nombre: "Ojo de bife" },
    { idCategoriaBase: 1, nombre: "Lomos finos" },
    { idCategoriaBase: 1, nombre: "Hueso de agujas" },
    { idCategoriaBase: 1, nombre: "Hueso de cogote" },
    { idCategoriaBase: 1, nombre: "Rila" },

    { idCategoriaBase: 2, nombre: "Bola de brazo" },
    { idCategoriaBase: 2, nombre: "Despegue de brazo" },
    { idCategoriaBase: 2, nombre: "Murillo" },
    { idCategoriaBase: 2, nombre: "Brazo tajar" },
    { idCategoriaBase: 2, nombre: "Hueso de paleta" },
    { idCategoriaBase: 2, nombre: "Canillas" },

    { idCategoriaBase: 3, nombre: "Centro de pierna" },
    { idCategoriaBase: 3, nombre: "Cadera" },
    { idCategoriaBase: 3, nombre: "Punta de anca" },
    { idCategoriaBase: 3, nombre: "Bola de pierna" },
    { idCategoriaBase: 3, nombre: "Bota" },
    { idCategoriaBase: 3, nombre: "Campana" },
    { idCategoriaBase: 3, nombre: "Murillo" },
    { idCategoriaBase: 3, nombre: "Hueso de cadera" },
    { idCategoriaBase: 3, nombre: "Cola" },
    { idCategoriaBase: 3, nombre: "Canillas" },

    { idCategoriaBase: 4, nombre: "Falda" },
    { idCategoriaBase: 4, nombre: "Pecho" },
    { idCategoriaBase: 4, nombre: "Sobrebarriga" },
    { idCategoriaBase: 4, nombre: "Costilla" },
    { idCategoriaBase: 4, nombre: "Hueso de pecho" },

    { idCategoriaBase: 5, nombre: "Grasa de canal" },
    { idCategoriaBase: 5, nombre: "Grasa de desposte de canal" },
    { idCategoriaBase: 5, nombre: "Moler corriente" },

    { idCategoriaBase: 6, nombre: "Callo solo" },
    { idCategoriaBase: 6, nombre: "Menudo revuelto" },
    { idCategoriaBase: 6, nombre: "Higado" },
    { idCategoriaBase: 6, nombre: "Corazon" },
    { idCategoriaBase: 6, nombre: "Riñon" },
    { idCategoriaBase: 6, nombre: "Pajarilla" },
    { idCategoriaBase: 6, nombre: "Chunchullo grueso" },
    { idCategoriaBase: 6, nombre: "Chunchullo delgado" },
    { idCategoriaBase: 6, nombre: "Ubre" },
    { idCategoriaBase: 6, nombre: "Entraña" },
    { idCategoriaBase: 6, nombre: "Pulgarejo" },
    { idCategoriaBase: 6, nombre: "Patas de res" },
    { idCategoriaBase: 6, nombre: "Carne de cabeza" },
    { idCategoriaBase: 6, nombre: "Lengua" },
    { idCategoriaBase: 6, nombre: "Jeta (cuero de la cabeza)" },
    { idCategoriaBase: 6, nombre: "Raiz" },
    { idCategoriaBase: 6, nombre: "Bofe (pulmones)" },
  ];

  await prisma.subparteBase.createMany({
    data: subpartesBase,
    skipDuplicates: true,
  });

  console.log("✔ Subpartes base insertadas.");

  // ============================================================
  // 3. Insertar proveedor de prueba
  // ============================================================
  const proveedor1 = await prisma.proveedor.create({
    data: {
      nombre: "Finca El Roble",
      tipoAnimal: "res",
      tipoProveedor: "natural",
      cedulaNit: "123456789",
      telefono: "3001234567",
      ciudad: "Bogotá",
    },
  });

  // ============================================================
  // 4. Crear lotes de prueba
  // ============================================================
  const loteRes = await prisma.lote.create({
    data: {
      tipoAnimal: "res",
      tipoIngreso: "matadero",
      proveedorId: proveedor1.id,
      pesoKgInicial: 350,
      pesoKgActual: 350,
      precioTotal: 4200000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  const loteCerdo = await prisma.lote.create({
    data: {
      tipoAnimal: "cerdo",
      tipoIngreso: "matadero",
      proveedorId: proveedor1.id,
      pesoKgInicial: 180,
      pesoKgActual: 180,
      precioTotal: 1800000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  console.log("✔ Proveedores y lotes creados.");

  // ============================================================
  // 5. CREAR CATEGORÍAS DE LOTE Y SUBPARTES DE PRUEBA
  // ============================================================
  
  // Primero crear categoría de lote
  const categoriaLoteRes = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes.id,
      idCategoriaBase: 1, // COGOTE
      pesoCategoriaKg: 40,
    },
  });

  // Ahora crear subpartes asociadas a esa categoría
  await prisma.subparteLote.createMany({
    data: [
      {
        idLote: loteRes.id,
        idCategoriaLote: categoriaLoteRes.id,
        idSubparteBase: 1, // Tapa de cogote
        pesoSubparteKg: 22,
      },
      {
        idLote: loteRes.id,
        idCategoriaLote: categoriaLoteRes.id,
        idSubparteBase: 3, // Cogote
        pesoSubparteKg: 18,
      },
    ],
  });

  console.log("✔ Categorías de lote y subpartes añadidas.");

  console.log("🌱 Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
