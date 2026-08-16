const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cerdoProd = await prisma.productoBase.findMany({
    where: { categoria: { equals: 'cerdo', mode: 'insensitive' } }
  });
  console.log("--- CERDO PRODUCTOS BASE ---");
  cerdoProd.forEach(p => {
    console.log(`ID: ${p.id} | Nombre: ${p.nombre} | Cat: ${p.categoria}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
