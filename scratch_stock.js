const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== DIAGNOSTIC STOCK ===");
  
  // Find all subpartes base containing 'costilla'
  const subpartesBase = await prisma.subparteBase.findMany({
    where: { nombre: { contains: 'costilla', mode: 'insensitive' } },
    include: { categoria: true }
  });
  console.log("\n--- Subpartes Base matching 'costilla': ---");
  console.log(JSON.stringify(subpartesBase, null, 2));

  // Find all subparte lotes matching those base IDs
  const baseIds = subpartesBase.map(s => s.id);
  const subpartesLote = await prisma.subparteLote.findMany({
    where: { idSubparteBase: { in: baseIds } },
    include: { lote: true }
  });
  console.log("\n--- Subparte Lotes matching those base IDs: ---");
  console.log(JSON.stringify(subpartesLote.map(sl => ({
    id: sl.id,
    idLote: sl.idLote,
    pesoSubparteKg: sl.pesoSubparteKg,
    tipoAnimal: sl.lote?.tipoAnimal,
    fechaPesado: sl.fechaPesado
  })), null, 2));

  // Find all lotes
  const lotes = await prisma.lote.findMany({
    orderBy: { id: 'desc' },
    take: 5
  });
  console.log("\n--- Last 5 Lotes: ---");
  console.log(JSON.stringify(lotes, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
