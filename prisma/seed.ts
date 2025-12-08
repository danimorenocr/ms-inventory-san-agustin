import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de categorías, subpartes y datos de prueba...");

  // ============================================================
  // 1. Categorías Base
  // ============================================================
  const categoriasBase = [
    // RES
    { id: 1, tipoAnimal: "res", nombre: "Cogote" },
    { id: 2, tipoAnimal: "res", nombre: "Brazos" },
    { id: 3, tipoAnimal: "res", nombre: "Piernas" },
    { id: 4, tipoAnimal: "res", nombre: "Costillas" },
    { id: 5, tipoAnimal: "res", nombre: "Otros" },
    { id: 6, tipoAnimal: "res", nombre: "Vísceras" },
    
    // CERDO
    { id: 7, tipoAnimal: "cerdo", nombre: "Pernil" },
    { id: 8, tipoAnimal: "cerdo", nombre: "Lomo" },
    { id: 9, tipoAnimal: "cerdo", nombre: "Costilla" },
    { id: 10, tipoAnimal: "cerdo", nombre: "Espinazo" },
    { id: 11, tipoAnimal: "cerdo", nombre: "Panceta" },
    { id: 12, tipoAnimal: "cerdo", nombre: "Moler/Longaniza" },
    { id: 13, tipoAnimal: "cerdo", nombre: "Tocino" },
    { id: 14, tipoAnimal: "cerdo", nombre: "Cabeza" },
    { id: 15, tipoAnimal: "cerdo", nombre: "Hueso" },
    { id: 16, tipoAnimal: "cerdo", nombre: "Brazo" },
    { id: 17, tipoAnimal: "cerdo", nombre: "Pezuñas" },
    { id: 18, tipoAnimal: "cerdo", nombre: "Bondiola" },
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

    { idCategoriaBase: 5, nombre: "Grasa de cortes primarios" },
    { idCategoriaBase: 5, nombre: "Grasa de cortes secundarios" },
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
    // 2.1. Productos Base (mismos nombres que subpartes)
    // ============================================================
    const productosBase = subpartesBase.map((subparte, idx) => ({
      nombre: subparte.nombre,
      categoria: undefined,
      estado: true,
    }));

    await prisma.productoBase.createMany({
      data: productosBase,
      skipDuplicates: true,
    });

    console.log("✔ Productos base insertados (mismos nombres que subpartes).");

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
  // 5. CREAR LOTE ADICIONAL PARA PROBAR SUMA DE SUBPARTES
  // ============================================================
  const loteRes2 = await prisma.lote.create({
    data: {
      tipoAnimal: "res",
      tipoIngreso: "matadero",
      proveedorId: proveedor1.id,
      pesoKgInicial: 400,
      pesoKgActual: 400,
      precioTotal: 5000000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  const loteRes3 = await prisma.lote.create({
    data: {
      tipoAnimal: "res",
      tipoIngreso: "matadero",
      proveedorId: proveedor1.id,
      pesoKgInicial: 380,
      pesoKgActual: 380,
      precioTotal: 4500000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  console.log("✔ Lotes adicionales creados.");

  // ============================================================
  // 6. CREAR CATEGORÍAS DE LOTE Y SUBPARTES DE PRUEBA
  // ============================================================
  
  // Categoría Cogote - Lote 1
  const categoriaLoteRes1Cogote = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes.id,
      idCategoriaBase: 1, // COGOTE
      pesoCategoriaKg: 50,
    },
  });

  // Categoría Brazos - Lote 1
  const categoriaLoteRes1Brazos = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes.id,
      idCategoriaBase: 2, // BRAZOS
      pesoCategoriaKg: 45,
    },
  });

  // Categoría Cogote - Lote 2
  const categoriaLoteRes2Cogote = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes2.id,
      idCategoriaBase: 1, // COGOTE
      pesoCategoriaKg: 60,
    },
  });

  // Categoría Brazos - Lote 2
  const categoriaLoteRes2Brazos = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes2.id,
      idCategoriaBase: 2, // BRAZOS
      pesoCategoriaKg: 55,
    },
  });

  // Categoría Cogote - Lote 3
  const categoriaLoteRes3Cogote = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes3.id,
      idCategoriaBase: 1, // COGOTE
      pesoCategoriaKg: 45,
    },
  });

  console.log("✔ Categorías de lote creadas.");

  // ============================================================
  // 7. CREAR SUBPARTES CON PESOS DIFERENTES
  // ============================================================
  await prisma.subparteLote.createMany({
    data: [
      // LOTE 1 - Cogote
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Cogote.id, idSubparteBase: 1, pesoSubparteKg: 22 }, // Tapa de cogote
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Cogote.id, idSubparteBase: 3, pesoSubparteKg: 18 }, // Cogote
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Cogote.id, idSubparteBase: 5, pesoSubparteKg: 10 }, // Ojo de bife

      // LOTE 1 - Brazos
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Brazos.id, idSubparteBase: 10, pesoSubparteKg: 25 }, // Bola de brazo
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Brazos.id, idSubparteBase: 12, pesoSubparteKg: 20 }, // Murillo

      // LOTE 2 - Cogote (mismo tipo de subpartes para sumar)
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Cogote.id, idSubparteBase: 1, pesoSubparteKg: 30 }, // Tapa de cogote
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Cogote.id, idSubparteBase: 3, pesoSubparteKg: 20 }, // Cogote
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Cogote.id, idSubparteBase: 5, pesoSubparteKg: 10 }, // Ojo de bife

      // LOTE 2 - Brazos
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Brazos.id, idSubparteBase: 10, pesoSubparteKg: 30 }, // Bola de brazo
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Brazos.id, idSubparteBase: 12, pesoSubparteKg: 25 }, // Murillo

      // LOTE 3 - Cogote
      { idLote: loteRes3.id, idCategoriaLote: categoriaLoteRes3Cogote.id, idSubparteBase: 1, pesoSubparteKg: 25 }, // Tapa de cogote
      { idLote: loteRes3.id, idCategoriaLote: categoriaLoteRes3Cogote.id, idSubparteBase: 3, pesoSubparteKg: 15 }, // Cogote
      { idLote: loteRes3.id, idCategoriaLote: categoriaLoteRes3Cogote.id, idSubparteBase: 5, pesoSubparteKg: 5 },  // Ojo de bife
    ],
  });

  console.log("✔ Subpartes con diferentes pesos añadidas.");
  console.log("\n📊 RESUMEN DE DATOS:");
  console.log("- Tapa de cogote (id: 1): 22 + 30 + 25 = 77 kg");
  console.log("- Cogote (id: 3): 18 + 20 + 15 = 53 kg");
  console.log("- Ojo de bife (id: 5): 10 + 10 + 5 = 25 kg");
  console.log("- Bola de brazo (id: 10): 25 + 30 = 55 kg");
  console.log("- Murillo (id: 12): 20 + 25 = 45 kg");

  console.log("\n🌱 Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });