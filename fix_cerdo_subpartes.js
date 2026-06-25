const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Fetching CategoriaBase for 'cerdo'...");
  const categoriasCerdo = await prisma.categoriaBase.findMany({
    where: { tipoAnimal: { equals: 'cerdo', mode: 'insensitive' } }
  });

  if (categoriasCerdo.length === 0) {
    console.log("No Cerdo categories found.");
    return;
  }

  for (const cat of categoriasCerdo) {
    console.log(`Processing category: ${cat.nombre} (ID: ${cat.id})`);
    
    // Check if a SubparteBase already exists for this category
    let subparte = await prisma.subparteBase.findFirst({
      where: {
        idCategoriaBase: cat.id,
        nombre: { equals: cat.nombre, mode: 'insensitive' }
      }
    });

    if (!subparte) {
      console.log(`  -> Creating SubparteBase for ${cat.nombre}...`);
      subparte = await prisma.subparteBase.create({
        data: {
          nombre: cat.nombre,
          idCategoriaBase: cat.id,
          estado: true
        }
      });
    } else {
      console.log(`  -> SubparteBase already exists for ${cat.nombre} (ID: ${subparte.id})`);
    }

    const categoriasLote = await prisma.categoriaLote.findMany({
      where: {
        idCategoriaBase: cat.id,
        pesoCategoriaKg: { gt: 0 } // Only migrate those with positive weight
      }
    });

    for (const cl of categoriasLote) {
      console.log(`  -> Migrating weight ${cl.pesoCategoriaKg}kg from CategoriaLote (Lote ID: ${cl.idLote})`);
      
      let sl = await prisma.subparteLote.findFirst({
        where: {
          idLote: cl.idLote,
          idSubparteBase: subparte.id
        }
      });

      if (!sl) {
        await prisma.subparteLote.create({
          data: {
            idLote: cl.idLote,
            idCategoriaLote: cl.id,
            idSubparteBase: subparte.id,
            pesoSubparteKg: cl.pesoCategoriaKg,
            fechaPesado: cl.fechaRegistro || new Date()
          }
        });
        
        console.log(`    -> Created SubparteLote with ${cl.pesoCategoriaKg}kg`);
      } else {
        console.log(`    -> SubparteLote already exists. Skipping migration for this lote.`);
      }
    }
  }

  console.log("Migration completed.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
