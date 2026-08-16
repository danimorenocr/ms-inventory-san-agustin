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
  // 2. Subpartes Base
  // ============================================================

  const subpartesBase = [
    // COGOTE
    { idCategoriaBase: 1, nombre: "Tapa de cogote" },
    { idCategoriaBase: 1, nombre: "Descargue" },
    { idCategoriaBase: 1, nombre: "Cogote" },
    { idCategoriaBase: 1, nombre: "Chatas" },
    { idCategoriaBase: 1, nombre: "Ojo de bife" },
    { idCategoriaBase: 1, nombre: "Lomos finos" },
    { idCategoriaBase: 1, nombre: "Hueso de agujas" },
    { idCategoriaBase: 1, nombre: "Hueso de cogote" },
    { idCategoriaBase: 1, nombre: "Rila" },

    // BRAZOS
    { idCategoriaBase: 2, nombre: "Bola de brazo" },
    { idCategoriaBase: 2, nombre: "Despegue de brazo" },
    { idCategoriaBase: 2, nombre: "Murillo" },
    { idCategoriaBase: 2, nombre: "Brazo tajar" },
    { idCategoriaBase: 2, nombre: "Hueso de paleta" },
    { idCategoriaBase: 2, nombre: "Canillas" },

    // PIERNAS
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

    // COSTILLAS
    { idCategoriaBase: 4, nombre: "Falda" },
    { idCategoriaBase: 4, nombre: "Pecho" },
    { idCategoriaBase: 4, nombre: "Sobrebarriga" },
    { idCategoriaBase: 4, nombre: "Costilla" },
    { idCategoriaBase: 4, nombre: "Hueso de pecho" },

    // OTROS
    { idCategoriaBase: 5, nombre: "Grasa de cortes primarios" },
    { idCategoriaBase: 5, nombre: "Grasa de cortes secundarios" },
    { idCategoriaBase: 5, nombre: "Moler corriente" },

    // VÍSCERAS
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
  // 2.1. Productos Base
  // ============================================================

  const productosBase = subpartesBase.map((subparte) => ({
    nombre: subparte.nombre,
    categoria: "res",
    estado: true,
  }));

  await prisma.productoBase.createMany({
    data: productosBase,
    skipDuplicates: true,
  });

  console.log("✔ Productos base insertados.");

  // ============================================================
  // 2.2. PRODUCTOS DE VENTA
  // ============================================================

  console.log("\n🥩 Creando productos de venta...");

  const productosVenta = [
    // Pierna / Milanesa / Asar / Fritar
    "Descargue",
    "Bola de brazo",
    "Despegue de brazo",
    "Brazo tajar",
    "Centro de pierna",
    "Punta de anca",
    "Cadera",
    "Bola de pierna",
    "Bota",
    "Campana",

    // Sobrebarriga
    "Tapa de cogote",
    "Cogote",
    "Falda",
    "Pecho",
    "Sobrebarriga",
    "Pulgarejo",
  ];

  for (const nombre of productosVenta) {
    try {
      const subparte = await prisma.subparteBase.findFirst({
        where: {
          nombre: {
            equals: nombre,
            mode: "insensitive",
          },
        },
      });

      if (!subparte) {
        console.log(`⚠️ No se encontró SubparteBase para: ${nombre}`);
        continue;
      }

      let productoSalida = await prisma.productoSalida.findFirst({
        where: {
          nombre: {
            equals: nombre,
            mode: "insensitive",
          },
        },
      });

      if (!productoSalida) {
        productoSalida = await prisma.productoSalida.create({
          data: {
            nombre,
            unidad: "kg",
            precio: null,
            etiqueta: null,
            activo: true,
          },
        });

        console.log(`✅ Producto de venta creado: ${nombre}`);
      } else {
        console.log(`⏭️ Producto de venta ya existe: ${nombre}`);
      }

      const componenteExistente =
        await prisma.productoSalidaComponente.findUnique({
          where: {
            productoSalidaId_subparteBaseId: {
              productoSalidaId: productoSalida.id,
              subparteBaseId: subparte.id,
            },
          },
        });

      if (!componenteExistente) {
        await prisma.productoSalidaComponente.create({
          data: {
            productoSalidaId: productoSalida.id,
            subparteBaseId: subparte.id,
            factorAsignacion: 1,
          },
        });

        console.log(
          `   🔗 ${nombre} → SubparteBase #${subparte.id}`
        );
      } else {
        console.log(`   ⏭️ Relación ya existe: ${nombre}`);
      }
    } catch (error) {
      console.error(`❌ Error procesando producto ${nombre}:`, error);
    }
  }

  console.log("✔ Productos de venta vinculados al inventario.");

  // ============================================================
  // 3. Procedencias
  // ============================================================

  const procedenciasData = [
    { nombre: "VillaPinzon" },
  ];

  await prisma.procedencia.createMany({
    data: procedenciasData,
    skipDuplicates: true,
  });

  console.log("✔ Procedencias insertadas.");

  // ============================================================
  // 4. Insertar proveedores de prueba
  // ============================================================

  await prisma.proveedor.create({
    data: {
      nombre: "Yuber",
      tipoAnimal: "res",
      tipoProveedor: "natural",
      cedulaNit: "123456789",
      telefono: "3001234567",
      ciudad: "Tunja",
    },
  });

  await prisma.proveedor.create({
    data: {
      nombre: "Jose Vargas",
      tipoAnimal: "cerdo",
      tipoProveedor: "mm",
      cedulaNit: "900123456-1",
      telefono: "30000000",
      ciudad: "Tunja",
    },
  });

  await prisma.proveedor.create({
    data: {
      nombre: "Alimentos Bieff",
      tipoAnimal: "cerdo",
      tipoProveedor: "mm",
      cedulaNit: "900123456-1",
      telefono: "30000000",
      ciudad: "Tunja",
    },
  });

  console.log("✔ Proveedores insertados.");
  console.log("✨ Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });