import { PrismaCloudService } from './src/infraestructure/prisma/prisma-cloud.service';

async function test() {
  require('dotenv').config();
  const cloudService = new PrismaCloudService();
  await cloudService.onModuleInit();
  
  const lotes = await cloudService.lote.findMany({ take: 5, orderBy: { id: 'desc' } });
  console.log("Cloud Lotes:", lotes);
  
  await cloudService.onModuleDestroy();
}

test().catch(e => console.error(e));
