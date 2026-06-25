import { PrismaClient } from '@prisma/client-cloud';

async function test() {
  console.log("Connecting to cloud DB...");
  const prisma = new PrismaClient({
    datasourceUrl: 'postgresql://postgres:enLDWkxHFuPBuIvFnwdCrWRcvdimjIRm@reseau.proxy.rlwy.net:18510/railway?schema=inventory'
  });
  
  await prisma.$connect();
  console.log("Connected.");
  
  const lotes = await prisma.lote.findMany();
  console.log(`Found ${lotes.length} lotes in cloud.`);
  console.log(lotes);
  
  await prisma.$disconnect();
}

test().catch(e => console.error(e));
