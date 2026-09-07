import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: busca SubparteBase por nombre (case-insensitive)
async function findSub(nombre: string) {
  const s = await prisma.subparteBase.findFirst({
    where: { nombre: { equals: nombre, mode: "insensitive" } },
  });
  if (!s) console.warn(`   ⚠️  SubparteBase no encontrada: "${nombre}"`);
  return s;
}

// Helper: upsert ProductoSalida y vincula subpartes
async function upsertProducto(
  nombre: string,
  precio: number,
  unidad: string,
  subpartesNombres: string[]
) {
  let prod = await prisma.productoSalida.findFirst({
    where: { nombre: { equals: nombre, mode: "insensitive" } },
  });

  if (!prod) {
    prod = await prisma.productoSalida.create({
      data: { nombre, precio, unidad, activo: true },
    });
    console.log(`✅ Creado: "${nombre}" ($${precio.toLocaleString()}/${unidad})`);
  } else {
    // Actualizar precio si ya existe
    prod = await prisma.productoSalida.update({
      where: { id: prod.id },
      data: { precio, unidad },
    });
    console.log(`🔄 Actualizado: "${nombre}" ($${precio.toLocaleString()}/${unidad})`);
  }

  let vinculadas = 0;
  for (const nombreSub of subpartesNombres) {
    const sub = await findSub(nombreSub);
    if (!sub) continue;

    await prisma.productoSalidaComponente.upsert({
      where: {
        productoSalidaId_subparteBaseId: {
          productoSalidaId: prod.id,
          subparteBaseId: sub.id,
        },
      },
      update: {},
      create: {
        productoSalidaId: prod.id,
        subparteBaseId: sub.id,
        factorAsignacion: 1,
      },
    });
    vinculadas++;
  }

  if (subpartesNombres.length > 0) {
    console.log(`   🔗 ${vinculadas}/${subpartesNombres.length} subpartes vinculadas`);
  }
}

async function main() {
  console.log("🌱 Seed ProductoSalida — inventario cloud\n");

  // ══════════════════════════════════════════════════
  // RES — Cortes y Asar
  // ══════════════════════════════════════════════════

  // Pierna / Blandito para asar
  // Agrupa las subpartes de pierna: Centro de pierna, Cadera, Punta de anca,
  // Bola de pierna, Bota, Campana + las de brazo: Bola de brazo, Despegue de brazo, Brazo tajar
  await upsertProducto("Pierna / Blandito para asar", 28000, "kg", [
    "Centro de pierna",
    "Cadera",
    "Punta de anca",
    "Bola de pierna",
    "Bota",
    "Campana",
    "Bola de brazo",
    "Despegue de brazo",
    "Brazo tajar",
  ]);

  // Carne molida especial (pierna/blandito)
  // Mismas subpartes que la anterior (es la versión molida)
  await upsertProducto("Carne molida especial (pierna/blandito)", 28000, "kg", [
    "Centro de pierna",
    "Cadera",
    "Punta de anca",
    "Bola de pierna",
    "Bota",
    "Campana",
    "Bola de brazo",
    "Despegue de brazo",
    "Brazo tajar",
  ]);

  // De segunda (Murillo, sobrebarriga, falda, pecho, cogote/tapa)
  await upsertProducto(
    "De segunda (Murillo, sobrebarriga, falda, pecho, cogote/tapa)",
    24000,
    "kg",
    [
      "Murillo",
      "Sobrebarriga",
      "Falda",
      "Pecho",
      "Cogote",
      "Tapa de cogote",
    ]
  );

  // Costilla
  await upsertProducto("Costilla", 24000, "kg", ["Costilla"]);

  // Carne molida común
  await upsertProducto("Carne molida común", 12000, "kg", [
    "Moler corriente",
    "Grasa de cortes primarios",
    "Grasa de cortes secundarios",
  ]);

  // Lengua
  await upsertProducto("Lengua", 24000, "kg", ["Lengua"]);

  // Carne de cabeza
  await upsertProducto("Carne de cabeza", 16000, "kg", ["Carne de cabeza"]);

  // ══════════════════════════════════════════════════
  // RES — Vísceras y Huesos
  // ══════════════════════════════════════════════════

  await upsertProducto("Hígado solo", 20000, "kg", ["Higado"]);

  // Asadura revuelta = corazón + riñón + chunchullo + pajarilla + hígado
  await upsertProducto("Asadura revuelta", 16000, "kg", [
    "Corazon",
    "Riñon",
    "Chunchullo grueso",
    "Chunchullo delgado",
    "Pajarilla",
    "Higado",
  ]);

  // Asadura sola (sin hígado)
  await upsertProducto(
    "Asadura sola (Corazón, riñón, chunchullo, pajarilla)",
    16000,
    "kg",
    ["Corazon", "Riñon", "Chunchullo grueso", "Chunchullo delgado", "Pajarilla"]
  );

  await upsertProducto("Callo solo", 18000, "kg", ["Callo solo"]);

  await upsertProducto("Menudo revuelto", 14000, "kg", ["Menudo revuelto"]);

  await upsertProducto("Bofe", 10000, "unidad", ["Bofe (pulmones)"]);

  await upsertProducto("Patas de res", 10000, "kg", ["Patas de res"]);

  await upsertProducto("Hueso carnudo / Rillas / Chocozuelas", 8000, "kg", [
    "Hueso de pecho",
    "Hueso de cogote",
    "Hueso de agujas",
    "Hueso de cadera",
    "Hueso de paleta",
  ]);

  // ══════════════════════════════════════════════════
  // CERDO
  // ══════════════════════════════════════════════════

  await upsertProducto("Lomo / Costilla / Panceta", 24000, "kg", [
    "Lomo",
    "Costilla",
    "Panceta",
  ]);

  await upsertProducto("Pierna de cerdo", 22000, "kg", ["Pernil"]);

  await upsertProducto("Carne molida de cerdo", 20000, "kg", [
    "Moler/Longaniza",
  ]);

  await upsertProducto("Cabeza de cerdo", 20000, "unidad", ["Cabeza"]);

  await upsertProducto("Espinazo / Patas de cerdo", 16000, "kg", [
    "Espinazo",
    "Pezuñas",
  ]);

  await upsertProducto("Tocino (solo cuero)", 14000, "kg", ["Tocino"]);

  console.log("\n✨ Todos los productos de salida listos.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
