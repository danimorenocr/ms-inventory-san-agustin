import { PrismaService, syncContext } from './src/infraestructure/prisma/prisma.service';
import { PrismaCloudService } from './src/infraestructure/prisma/prisma-cloud.service';

async function test() {
  const cloudService = new PrismaCloudService();
  await cloudService.onModuleInit();
  
  const prisma = new PrismaService(cloudService);
  await prisma.onModuleInit();

  console.log("Without context:");
  const localLotes = await prisma.lote.findMany({ take: 1 });
  console.log("Local Lotes count:", localLotes.length, localLotes[0]?.id);

  console.log("With context useCloud = true:");
  await new Promise<void>((resolve, reject) => {
    syncContext.run({ useCloud: true }, async () => {
      try {
        const cloudLotes = await prisma.lote.findMany({ take: 1 });
        console.log("Cloud Lotes count:", cloudLotes.length, cloudLotes[0]?.id);
        
        // Let's create a test lote in cloud
        console.log("Creating test lote in cloud through proxy...");
        const newLote = await prisma.lote.create({
          data: {
            tipoIngreso: 'test',
            tipoAnimal: 'res',
            pesoKgInicial: 10,
            pesoKgActual: 10,
            precioTotal: 100,
            idUsuario: 1,
            proveedorId: 1
          }
        });
        console.log("Created lote ID:", newLote.id);
        
        // delete it
        await prisma.lote.delete({ where: { id: newLote.id } });
        console.log("Deleted test lote");

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  await prisma.onModuleDestroy();
  await cloudService.onModuleDestroy();
}

test().catch(console.error);
