import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Iniciando seed de categorías y subpartes...");

  // ==========================================
  // 1. Categorías Base (Res)
  // ==========================================
  const categoriasBase = [
    { id: 1, tipoAnimal: "res", nombre: "Cogote" },
    { id: 2, tipoAnimal: "res", nombre: "Brazos" },
    { id: 3, tipoAnimal: "res", nombre: "Piernas" },
    { id: 4, tipoAnimal: "res", nombre: "Costillas" },
    { id: 5, tipoAnimal: "res", nombre: "Otros" },
    { id: 6, tipoAnimal: "res", nombre: "Vísceras" },
  ];

  await prisma.categoriaBase.createMany({
    data: categoriasBase,
    skipDuplicates: true,
  });

  console.log("✔ Categorías base insertadas.");

  // ==========================================
  // 2. Subpartes Base
  // ==========================================

  const subpartesBase = [
    // ===========================
    // COGOTE (idCategoriaBase = 1)
    // ===========================
    { idCategoriaBase: 1, nombre: "Tapa de cogote" },
    { idCategoriaBase: 1, nombre: "Descargue" },
    { idCategoriaBase: 1, nombre: "Cogote" },
    { idCategoriaBase: 1, nombre: "Chatas" },
    { idCategoriaBase: 1, nombre: "Ojo de bife" },
    { idCategoriaBase: 1, nombre: "Lomos finos" },
    { idCategoriaBase: 1, nombre: "Hueso de agujas" },
    { idCategoriaBase: 1, nombre: "Hueso de cogote" },
    { idCategoriaBase: 1, nombre: "Rila" },

    // ===========================
    // BRAZOS (idCategoriaBase = 2)
    // ===========================
    { idCategoriaBase: 2, nombre: "Bola de brazo" },
    { idCategoriaBase: 2, nombre: "Despegue de brazo" },
    { idCategoriaBase: 2, nombre: "Murillo" },
    { idCategoriaBase: 2, nombre: "Brazo tajar" },
    { idCategoriaBase: 2, nombre: "Hueso de paleta" },
    { idCategoriaBase: 2, nombre: "Canillas" },

    // ===========================
    // PIERNAS (idCategoriaBase = 3)
    // ===========================
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

    // ===========================
    // COSTILLAS (idCategoriaBase = 4)
    // ===========================
    { idCategoriaBase: 4, nombre: "Falda" },
    { idCategoriaBase: 4, nombre: "Pecho" },
    { idCategoriaBase: 4, nombre: "Sobrebarriga" },
    { idCategoriaBase: 4, nombre: "Costilla" },
    { idCategoriaBase: 4, nombre: "Hueso de pecho" },

    // ===========================
    // OTROS (idCategoriaBase = 5)
    // ===========================
    { idCategoriaBase: 5, nombre: "Grasa de canal" },
    { idCategoriaBase: 5, nombre: "Grasa de desposte de canal" },
    { idCategoriaBase: 5, nombre: "Moler corriente" },

    // ===========================
    // VISCERAS (idCategoriaBase = 6)
    // ===========================
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

  // ==========================================
  // 3. Productos Base (Individuales)
  // ==========================================
  const productosBase = [
    // Vísceras de res
    { nombre: "Hígado de res", categoria: "vísceras" },
    { nombre: "Corazón de res", categoria: "vísceras" },
    { nombre: "Riñones de res", categoria: "vísceras" },
    { nombre: "Lengua de res", categoria: "vísceras" },
    { nombre: "Mondongo", categoria: "vísceras" },
    
    // Pescados
    { nombre: "Salmón", categoria: "pescado" },
    { nombre: "Tilapia", categoria: "pescado" },
    { nombre: "Bagre", categoria: "pescado" },
    { nombre: "Trucha", categoria: "pescado" },
    { nombre: "Pargo", categoria: "pescado" },
    
    // Pollo
    { nombre: "Pechuga de pollo", categoria: "pollo" },
    { nombre: "Muslo de pollo", categoria: "pollo" },
    { nombre: "Alas de pollo", categoria: "pollo" },
    { nombre: "Pierna de pollo", categoria: "pollo" },
    { nombre: "Pollo entero", categoria: "pollo" },
    
    // Cerdo
    { nombre: "Chuleta de cerdo", categoria: "cerdo" },
    { nombre: "Costilla de cerdo", categoria: "cerdo" },
    { nombre: "Lomo de cerdo", categoria: "cerdo" },
    { nombre: "Tocino", categoria: "cerdo" },
    { nombre: "Pernil de cerdo", categoria: "cerdo" },
    
    // Embutidos
    { nombre: "Chorizo", categoria: "embutidos" },
    { nombre: "Salchicha", categoria: "embutidos" },
    { nombre: "Morcilla", categoria: "embutidos" },
    { nombre: "Longaniza", categoria: "embutidos" },
  ];

  await prisma.productoBase.createMany({
    data: productosBase,
    skipDuplicates: true,
  });

  console.log("✔ Productos base insertados.");

  // ==========================================
  // 4. Proveedores
  // ==========================================
  const proveedores = [
    {
      nombre: "Ganadería El Paraíso",
      tipoAnimal: "res",
      telefono: "3101234567",
      ciudad: "Villavicencio",
      tipoProveedor: "natural",
      direccion: "Vereda La Reforma",
      cedulaNit: "1234567890",
      correo: "contacto@ganaderiaparaiso.com",
      observacion: "Proveedor confiable de ganado de primera",
    },
    {
      nombre: "Frigorífico Los Andes",
      tipoAnimal: "res",
      telefono: "3209876543",
      ciudad: "Bogotá",
      tipoProveedor: "juridica",
      direccion: "Calle 80 # 45-67",
      cedulaNit: "900123456-7",
      correo: "ventas@frigorifico-andes.com",
      observacion: "Entregas puntuales, excelente calidad",
    },
    {
      nombre: "Porcícola San Martín",
      tipoAnimal: "cerdo",
      telefono: "3151234567",
      ciudad: "Bucaramanga",
      tipoProveedor: "natural",
      direccion: "Finca La Esperanza km 15",
      cedulaNit: "9876543210",
      correo: "sanmartin@porcicola.com",
    },
    {
      nombre: "Avícola Santa Rosa",
      tipoAnimal: "pollo",
      telefono: "3187654321",
      ciudad: "Pereira",
      tipoProveedor: "juridica",
      direccion: "Zona Industrial Bloque C",
      cedulaNit: "900987654-3",
      correo: "pedidos@avicolasantarosa.com",
      observacion: "Proveedor certificado, pollo fresco diario",
    },
    {
      nombre: "Pescadería El Mar",
      tipoAnimal: "pescado",
      telefono: "3002345678",
      ciudad: "Cartagena",
      tipoProveedor: "natural",
      direccion: "Mercado de Bazurto Local 45",
      cedulaNit: "5678901234",
      correo: "elmar@pescaderia.com",
      observacion: "Pescado fresco del día",
    },
    {
      nombre: "Distribuidora La Costa",
      tipoAnimal: "pescado",
      telefono: "3123456789",
      ciudad: "Barranquilla",
      tipoProveedor: "juridica",
      direccion: "Avenida del Río # 30-12",
      cedulaNit: "900456789-1",
      correo: "ventas@lacosta.com",
    },
  ];

  await prisma.proveedor.createMany({
    data: proveedores,
    skipDuplicates: true,
  });

  console.log("✔ Proveedores insertados.");
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