import { PrismaClient } from '@prisma/client';

async function test() {
  console.log("Connecting to local DB...");
  const prisma = new PrismaClient({
    datasourceUrl: 'postgresql://microadmin:12345678@localhost:5432/db_agustin_inventory?schema=public'
  });
  
  await prisma.$connect();
  console.log("Connected.");
  
  const lotes = await prisma.lote.findMany({ orderBy: { id: 'desc' }, take: 5 });
  console.log(`Latest 5 lotes in local:`);
  console.log(lotes);
  
  await prisma.$disconnect();
}

test().catch(e => console.error(e));
