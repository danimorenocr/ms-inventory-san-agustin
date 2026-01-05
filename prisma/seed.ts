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
  // 2. Subpartes Base (completo)
  // ============================================================
  const subpartesBase = [
    { idCategoriaBase: 1, nombre: "Tapa de cogote" },
    { idCategoriaBase: 1, nombre: "Descargue" },
    { idCategoriaBase: 1, nombre: "Cogote" },
    { idCategoriaBase: 1, nombre: "Chatas" },
    { idCategoriaBase: 1, nombre: "Ojo de bife" },
    { idCategoriaBase: 1, nombre: "Lomos finos" },
    { idCategoriaBase: 1, nombre: "Hueso de agujas" },
    { idCategoriaBase: 1, nombre: "Hueso de cogote" },
    { idCategoriaBase: 1, nombre: "Rila" },

    { idCategoriaBase: 2, nombre: "Bola de brazo" },
    { idCategoriaBase: 2, nombre: "Despegue de brazo" },
    { idCategoriaBase: 2, nombre: "Murillo" },
    { idCategoriaBase: 2, nombre: "Brazo tajar" },
    { idCategoriaBase: 2, nombre: "Hueso de paleta" },
    { idCategoriaBase: 2, nombre: "Canillas" },

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

    { idCategoriaBase: 4, nombre: "Falda" },
    { idCategoriaBase: 4, nombre: "Pecho" },
    { idCategoriaBase: 4, nombre: "Sobrebarriga" },
    { idCategoriaBase: 4, nombre: "Costilla" },
    { idCategoriaBase: 4, nombre: "Hueso de pecho" },

    { idCategoriaBase: 5, nombre: "Grasa de cortes primarios" },
    { idCategoriaBase: 5, nombre: "Grasa de cortes secundarios" },
    { idCategoriaBase: 5, nombre: "Moler corriente" },

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
  // 2.1. Productos Base (mismos nombres que subpartes)
  // ============================================================
  const productosBase = subpartesBase.map((subparte, idx) => ({
    nombre: subparte.nombre,
    categoria: "res",
    estado: true,
  }));

  await prisma.productoBase.createMany({
    data: productosBase,
    skipDuplicates: true,
  });

  console.log("✔ Productos base insertados (mismos nombres que subpartes).");

  // ============================================================
  // 2.5. Procedencias
  // ============================================================
  const procedenciasData = [
    { nombre: "Feria de Ganados" },
    { nombre: "Subasta Ganadera" },
    { nombre: "Finca La Esperanza" },
  ];

  await prisma.procedencia.createMany({
    data: procedenciasData,
    skipDuplicates: true,
  });

  const procedencia1 = await prisma.procedencia.findFirst();
  console.log("✔ Procedencias insertadas.");

  // ============================================================
  // 3. Insertar proveedores de prueba
  // ============================================================
  const proveedor1 = await prisma.proveedor.create({
    data: {
      nombre: "Finca El Roble",
      tipoAnimal: "res",
      tipoProveedor: "natural",
      cedulaNit: "123456789",
      telefono: "3001234567",
      ciudad: "Bogotá",
    },
  });

  const proveedor2 = await prisma.proveedor.create({
    data: {
      nombre: "Agricola San Pedro",
      tipoAnimal: "cerdo",
      tipoProveedor: "juridico",
      cedulaNit: "900123456-1",
      telefono: "3109876543",
      ciudad: "Medellín",
    },
  });

  // ============================================================
  // 4. Crear lotes de prueba
  // ============================================================
  const loteRes = await prisma.lote.create({
    data: {
      tipoAnimal: "res",
      tipoIngreso: "Planta de beneficio",
      proveedorId: proveedor1.id,
      procedenciaId: procedencia1?.id,
      pesoKgInicial: 350,
      pesoKgActual: 350,
      precioTotal: 4200000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  const loteCerdo = await prisma.lote.create({
    data: {
      tipoAnimal: "cerdo",
      tipoIngreso: "Planta de beneficio",
      proveedorId: proveedor1.id,
      pesoKgInicial: 180,
      pesoKgActual: 180,
      precioTotal: 1800000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  console.log("✔ Proveedores y lotes creados.");

  // ============================================================
  // 5. CREAR LOTE ADICIONAL PARA PROBAR SUMA DE SUBPARTES
  // ============================================================
  const loteRes2 = await prisma.lote.create({
    data: {
      tipoAnimal: "res",
      tipoIngreso: "Planta de beneficio",
      proveedorId: proveedor1.id,
      pesoKgInicial: 400,
      pesoKgActual: 400,
      precioTotal: 5000000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  const loteRes3 = await prisma.lote.create({
    data: {
      tipoAnimal: "res",
      tipoIngreso: "Planta de beneficio",
      proveedorId: proveedor1.id,
      pesoKgInicial: 380,
      pesoKgActual: 380,
      precioTotal: 4500000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    },
  });

  console.log("✔ Lotes adicionales creados.");

  // ============================================================
  // 6. CREAR CATEGORÍAS DE LOTE Y SUBPARTES DE PRUEBA
  // ============================================================

  // Categoría Cogote - Lote 1
  const categoriaLoteRes1Cogote = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes.id,
      idCategoriaBase: 1, // COGOTE
      pesoCategoriaKg: 50,
    },
  });

  // Categoría Brazos - Lote 1
  const categoriaLoteRes1Brazos = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes.id,
      idCategoriaBase: 2, // BRAZOS
      pesoCategoriaKg: 45,
    },
  });

  // Categoría Cogote - Lote 2
  const categoriaLoteRes2Cogote = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes2.id,
      idCategoriaBase: 1, // COGOTE
      pesoCategoriaKg: 60,
    },
  });

  // Categoría Brazos - Lote 2
  const categoriaLoteRes2Brazos = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes2.id,
      idCategoriaBase: 2, // BRAZOS
      pesoCategoriaKg: 55,
    },
  });

  // Categoría Cogote - Lote 3
  const categoriaLoteRes3Cogote = await prisma.categoriaLote.create({
    data: {
      idLote: loteRes3.id,
      idCategoriaBase: 1, // COGOTE
      pesoCategoriaKg: 45,
    },
  });

  console.log("✔ Categorías de lote creadas.");

  // ============================================================
  // 7. CREAR SUBPARTES CON PESOS DIFERENTES
  // ============================================================
  await prisma.subparteLote.createMany({
    data: [
      // LOTE 1 - Cogote
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Cogote.id, idSubparteBase: 1, pesoSubparteKg: 22 }, // Tapa de cogote
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Cogote.id, idSubparteBase: 3, pesoSubparteKg: 18 }, // Cogote
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Cogote.id, idSubparteBase: 5, pesoSubparteKg: 10 }, // Ojo de bife

      // LOTE 1 - Brazos
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Brazos.id, idSubparteBase: 10, pesoSubparteKg: 25 }, // Bola de brazo
      { idLote: loteRes.id, idCategoriaLote: categoriaLoteRes1Brazos.id, idSubparteBase: 12, pesoSubparteKg: 20 }, // Murillo

      // LOTE 2 - Cogote (mismo tipo de subpartes para sumar)
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Cogote.id, idSubparteBase: 1, pesoSubparteKg: 30 }, // Tapa de cogote
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Cogote.id, idSubparteBase: 3, pesoSubparteKg: 20 }, // Cogote
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Cogote.id, idSubparteBase: 5, pesoSubparteKg: 10 }, // Ojo de bife

      // LOTE 2 - Brazos
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Brazos.id, idSubparteBase: 10, pesoSubparteKg: 30 }, // Bola de brazo
      { idLote: loteRes2.id, idCategoriaLote: categoriaLoteRes2Brazos.id, idSubparteBase: 12, pesoSubparteKg: 25 }, // Murillo

      // LOTE 3 - Cogote
      { idLote: loteRes3.id, idCategoriaLote: categoriaLoteRes3Cogote.id, idSubparteBase: 1, pesoSubparteKg: 25 }, // Tapa de cogote
      { idLote: loteRes3.id, idCategoriaLote: categoriaLoteRes3Cogote.id, idSubparteBase: 3, pesoSubparteKg: 15 }, // Cogote
      { idLote: loteRes3.id, idCategoriaLote: categoriaLoteRes3Cogote.id, idSubparteBase: 5, pesoSubparteKg: 5 },  // Ojo de bife
    ],
  });

  console.log("✔ Subpartes con diferentes pesos añadidas.");

  // ============================================================
  // 8. Lotes Individuales
  // ============================================================

  // Lote padre para el lote individual
  const loteIndividualParent = await prisma.lote.create({
    data: {
      tipoAnimal: "res",
      tipoIngreso: "compra-individual",
      proveedorId: proveedor2.id,
      procedenciaId: procedencia1?.id,
      pesoKgInicial: 15,
      pesoKgActual: 15,
      precioTotal: 200000,
      idUsuario: 1,
      fechaIngreso: new Date(),
    }
  });

  // Crear el registro de LoteIndividual
  // Usamos un ID de producto base existente, ej: 5 (Ojo de bife)
  await prisma.loteIndividual.create({
    data: {
      idLote: loteIndividualParent.id,
      idProductoBase: 5,
      pesoKg: 15,
      precioKg: 13333,
      precioTotal: 200000,
      unidades: 10,
      procedenciaId: procedencia1?.id
    }
  });
  console.log("✔ Lote Individual creado.");
  console.log("\n📊 RESUMEN DE DATOS:");
  console.log("- Tapa de cogote (id: 1): 22 + 30 + 25 = 77 kg");
  console.log("- Cogote (id: 3): 18 + 20 + 15 = 53 kg");
  console.log("- Ojo de bife (id: 5): 10 + 10 + 5 = 25 kg");
  console.log("- Bola de brazo (id: 10): 25 + 30 = 55 kg");
  console.log("- Murillo (id: 12): 20 + 25 = 45 kg");

  // ============================================================
  // 8. CREAR PROCEDENCIAS
  // ============================================================
  const procedenciaFinca = await prisma.procedencia.create({
    data: {
      nombre: "Finca San Agustín"
    }
  });

  const procedenciaMatadero = await prisma.procedencia.create({
    data: {
      nombre: "Matadero Central"
    }
  });

  console.log("✔ Procedencias creadas.");

  // ============================================================
  // 9. CREAR LOTES INDIVIDUALES (COMPRAS)
  // ============================================================
  const productosBaseList = await prisma.productoBase.findMany({ take: 3 });

  const loteIndividual1 = await prisma.loteIndividual.create({
    data: {
      idLote: (await prisma.lote.create({
        data: {
          tipoAnimal: "res",
          tipoIngreso: "Compra individual",
          proveedorId: proveedor1.id,
          pesoKgInicial: 50,
          pesoKgActual: 50,
          precioTotal: 600000,
          idUsuario: 1,
          procedenciaId: procedenciaFinca.id,
        }
      })).id,
      idProductoBase: productosBaseList[0]?.id || 1,
      pesoKg: 50,
      precioKg: 12000,
      precioTotal: 600000,
      unidades: 1,
    }
  });

  const loteIndividual2 = await prisma.loteIndividual.create({
    data: {
      idLote: (await prisma.lote.create({
        data: {
          tipoAnimal: "res",
          tipoIngreso: "Compra individual",
          proveedorId: proveedor1.id,
          pesoKgInicial: 30,
          pesoKgActual: 30,
          precioTotal: 360000,
          idUsuario: 1,
          procedenciaId: procedenciaMatadero.id,
        }
      })).id,
      idProductoBase: productosBaseList[1]?.id || 2,
      pesoKg: 30,
      precioKg: 12000,
      precioTotal: 360000,
      unidades: 1,
    }
  });

  console.log("✔ Lotes individuales creados.");

  // ============================================================
  // 10. CREAR PRODUCTOS DE SALIDA
  // ============================================================
  const productoSalida1 = await prisma.productoSalida.create({
    data: {
      nombre: "Corte Premium",
      unidad: "kg",
      etiqueta: "PREMIUM",
      activo: true
    }
  });

  const productoSalida2 = await prisma.productoSalida.create({
    data: {
      nombre: "Corte Estándar",
      unidad: "kg",
      etiqueta: "STANDARD",
      activo: true
    }
  });

  const productoSalida3 = await prisma.productoSalida.create({
    data: {
      nombre: "Paquete Económico",
      unidad: "unidad",
      etiqueta: "ECO",
      activo: true
    }
  });

  console.log("✔ Productos de salida creados.");

  // ============================================================
  // 11. ASOCIAR COMPONENTES DE PRODUCTOS DE SALIDA
  // ============================================================
  const subpartesLote = await prisma.subparteLote.findMany({ take: 3 });
  
  // Componente base para producto de salida
  if (productosBaseList[0]) {
    await prisma.productoSalidaComponente.create({
      data: {
        productoSalidaId: productoSalida1.id,
        subparteBaseId: productosBaseList[0].id
      }
    });
  }

  if (subpartesLote[0]) {
    await prisma.productoSalidaComponenteLote.create({
      data: {
        productoSalidaId: productoSalida1.id,
        loteId: loteRes.id
      }
    });
  }

  if (subpartesLote[1]) {
    await prisma.productoSalidaComponenteSubparte.create({
      data: {
        productoSalidaId: productoSalida2.id,
        subparteLoteId: subpartesLote[1].id
      }
    });
  }

  await prisma.productoSalidaComponenteIndividual.create({
    data: {
      productoSalidaId: productoSalida3.id,
      loteIndividualId: loteIndividual1.idLote
    }
  });

  console.log("✔ Componentes de productos de salida asociados.");

  // ============================================================
  // 12. CREAR MOVIMIENTOS DE INVENTARIO
  // ============================================================
  if (subpartesLote[0]) {
    await prisma.movimientoInventario.createMany({
      data: [
        {
          tipo: "VENTA",
          referenciaId: productoSalida1.id,
          subparteLoteId: subpartesLote[0].id,
          subparteBaseId: subpartesLote[0].idSubparteBase,
          peso: 10,
          fecha: new Date()
        },
        {
          tipo: "MERMA",
          referenciaId: null,
          subparteLoteId: subpartesLote[0].id,
          subparteBaseId: subpartesLote[0].idSubparteBase,
          peso: 2,
          fecha: new Date()
        }
      ]
    });
  }

  if (subpartesLote[1]) {
    await prisma.movimientoInventario.create({
      data: {
        tipo: "AJUSTE",
        referenciaId: null,
        subparteLoteId: subpartesLote[1].id,
        subparteBaseId: subpartesLote[1].idSubparteBase,
        peso: 5,
        fecha: new Date()
      }
    });
  }

  console.log("✔ Movimientos de inventario creados.");

  // ============================================================
  // 13. CREAR ALERTAS
  // ============================================================
  await prisma.alerta.createMany({
    data: [
      {
        tipo: "INFO",
        mensaje: "Nuevo lote ingresado: Res #" + loteRes.id,
        fecha: new Date(),
        leida: false
      },
      {
        tipo: "WARNING",
        mensaje: "Stock bajo en Cogote",
        fecha: new Date(),
        leida: false
      },
      {
        tipo: "CRITICO",
        mensaje: "Temperatura fuera de rango en almacén",
        fecha: new Date(Date.now() - 86400000), // Hace 1 día
        leida: true
      }
    ]
  });

  console.log("✔ Alertas creadas.");

  // ============================================================
  // 14. CREAR ALERTAS POR REGLA
  // ============================================================
  if (subpartesLote[0]) {
    await prisma.alertaRegla.createMany({
      data: [
        {
          subparteLoteId: subpartesLote[0].id,
          tipo: "MINIMO_KG",
          valor: 5,
          activa: true,
          fechaCreada: new Date()
        },
        {
          loteId: loteRes.id,
          tipo: "PORCENTAJE",
          valor: 20,
          activa: true,
          fechaCreada: new Date()
        }
      ]
    });
  }

  if (productosBaseList[0]) {
    await prisma.alertaRegla.create({
      data: {
        productoId: productosBaseList[0].id,
        tipo: "MINIMO_KG",
        valor: 10,
        activa: true,
        fechaCreada: new Date()
      }
    });
  }

  if (loteIndividual1) {
    await prisma.alertaRegla.create({
      data: {
        loteIndividualId: loteIndividual1.idLote,
        tipo: "PORCENTAJE",
        valor: 15,
        activa: true,
        fechaCreada: new Date()
      }
    });
  }

  console.log("✔ Alertas por regla creadas.");

  console.log("\n🌱 Seed completado con éxito - Todas las tablas pobladas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });