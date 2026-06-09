-- CreateTable
CREATE TABLE "CategoriaBase" (
    "id" SERIAL NOT NULL,
    "tipoAnimal" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CategoriaBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubparteBase" (
    "id" SERIAL NOT NULL,
    "idCategoriaBase" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "reservaCombosKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consumidoCombosKg" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "SubparteBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoSalida" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "precio" DOUBLE PRECISION,
    "etiqueta" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductoSalida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoSalidaComponente" (
    "id" SERIAL NOT NULL,
    "productoSalidaId" INTEGER NOT NULL,
    "subparteBaseId" INTEGER NOT NULL,
    "factorAsignacion" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductoSalidaComponente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoSalidaComponenteIndividual" (
    "id" SERIAL NOT NULL,
    "productoSalidaId" INTEGER NOT NULL,
    "productoBaseId" INTEGER NOT NULL,
    "factorAsignacion" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductoSalidaComponenteIndividual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedencia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Procedencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoAnimal" TEXT NOT NULL,
    "telefono" TEXT,
    "ciudad" TEXT,
    "tipoProveedor" TEXT NOT NULL,
    "direccion" TEXT,
    "cedulaNit" TEXT NOT NULL,
    "correo" TEXT,
    "observacion" TEXT,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" SERIAL NOT NULL,
    "tipoIngreso" TEXT NOT NULL,
    "tipoAnimal" TEXT NOT NULL,
    "procedenciaId" INTEGER,
    "guia" BOOLEAN,
    "fotoGuia" TEXT,
    "pesoKgInicial" DOUBLE PRECISION NOT NULL,
    "pesoKgActual" DOUBLE PRECISION NOT NULL,
    "pesoKgLimpio" DOUBLE PRECISION,
    "pesoArrobaLimpio" DOUBLE PRECISION,
    "precioKg" DOUBLE PRECISION,
    "precioArroba" DOUBLE PRECISION,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    "limpio" BOOLEAN,
    "sexo" TEXT,
    "clasificacion" TEXT,
    "dientes" INTEGER,
    "despostado" BOOLEAN NOT NULL DEFAULT false,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,
    "proveedorId" INTEGER NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaLote" (
    "id" SERIAL NOT NULL,
    "idLote" INTEGER NOT NULL,
    "idCategoriaBase" INTEGER NOT NULL,
    "pesoCategoriaKg" DOUBLE PRECISION NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriaLote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubparteLote" (
    "id" SERIAL NOT NULL,
    "idLote" INTEGER NOT NULL,
    "idCategoriaLote" INTEGER NOT NULL,
    "idSubparteBase" INTEGER NOT NULL,
    "pesoSubparteKg" DOUBLE PRECISION NOT NULL,
    "fechaPesado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubparteLote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoBase" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "reservaCombosKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consumidoCombosKg" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductoBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoteIndividual" (
    "idLote" INTEGER NOT NULL,
    "idProductoBase" INTEGER NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "precioKg" DOUBLE PRECISION NOT NULL,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    "unidades" INTEGER,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procedenciaId" INTEGER,

    CONSTRAINT "LoteIndividual_pkey" PRIMARY KEY ("idLote")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "referenciaId" INTEGER,
    "subparteLoteId" INTEGER NOT NULL,
    "subparteBaseId" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertaRegla" (
    "id" SERIAL NOT NULL,
    "loteId" INTEGER,
    "categoriaLoteId" INTEGER,
    "subparteLoteId" INTEGER,
    "loteIndividualId" INTEGER,
    "productoId" INTEGER,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertaRegla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncQueue" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "synced" BOOLEAN NOT NULL DEFAULT false,
    "syncedAt" TIMESTAMP(3),

    CONSTRAINT "SyncQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductoSalidaComponente_productoSalidaId_subparteBaseId_key" ON "ProductoSalidaComponente"("productoSalidaId", "subparteBaseId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductoSalidaComponenteIndividual_productoSalidaId_product_key" ON "ProductoSalidaComponenteIndividual"("productoSalidaId", "productoBaseId");

-- AddForeignKey
ALTER TABLE "SubparteBase" ADD CONSTRAINT "SubparteBase_idCategoriaBase_fkey" FOREIGN KEY ("idCategoriaBase") REFERENCES "CategoriaBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoSalidaComponente" ADD CONSTRAINT "ProductoSalidaComponente_productoSalidaId_fkey" FOREIGN KEY ("productoSalidaId") REFERENCES "ProductoSalida"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoSalidaComponente" ADD CONSTRAINT "ProductoSalidaComponente_subparteBaseId_fkey" FOREIGN KEY ("subparteBaseId") REFERENCES "SubparteBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoSalidaComponenteIndividual" ADD CONSTRAINT "ProductoSalidaComponenteIndividual_productoSalidaId_fkey" FOREIGN KEY ("productoSalidaId") REFERENCES "ProductoSalida"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoSalidaComponenteIndividual" ADD CONSTRAINT "ProductoSalidaComponenteIndividual_productoBaseId_fkey" FOREIGN KEY ("productoBaseId") REFERENCES "ProductoBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_procedenciaId_fkey" FOREIGN KEY ("procedenciaId") REFERENCES "Procedencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriaLote" ADD CONSTRAINT "CategoriaLote_idLote_fkey" FOREIGN KEY ("idLote") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriaLote" ADD CONSTRAINT "CategoriaLote_idCategoriaBase_fkey" FOREIGN KEY ("idCategoriaBase") REFERENCES "CategoriaBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubparteLote" ADD CONSTRAINT "SubparteLote_idLote_fkey" FOREIGN KEY ("idLote") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubparteLote" ADD CONSTRAINT "SubparteLote_idCategoriaLote_fkey" FOREIGN KEY ("idCategoriaLote") REFERENCES "CategoriaLote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubparteLote" ADD CONSTRAINT "SubparteLote_idSubparteBase_fkey" FOREIGN KEY ("idSubparteBase") REFERENCES "SubparteBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoteIndividual" ADD CONSTRAINT "LoteIndividual_procedenciaId_fkey" FOREIGN KEY ("procedenciaId") REFERENCES "Procedencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoteIndividual" ADD CONSTRAINT "LoteIndividual_idLote_fkey" FOREIGN KEY ("idLote") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoteIndividual" ADD CONSTRAINT "LoteIndividual_idProductoBase_fkey" FOREIGN KEY ("idProductoBase") REFERENCES "ProductoBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_subparteLoteId_fkey" FOREIGN KEY ("subparteLoteId") REFERENCES "SubparteLote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaRegla" ADD CONSTRAINT "AlertaRegla_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaRegla" ADD CONSTRAINT "AlertaRegla_categoriaLoteId_fkey" FOREIGN KEY ("categoriaLoteId") REFERENCES "CategoriaLote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaRegla" ADD CONSTRAINT "AlertaRegla_subparteLoteId_fkey" FOREIGN KEY ("subparteLoteId") REFERENCES "SubparteLote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaRegla" ADD CONSTRAINT "AlertaRegla_loteIndividualId_fkey" FOREIGN KEY ("loteIndividualId") REFERENCES "LoteIndividual"("idLote") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaRegla" ADD CONSTRAINT "AlertaRegla_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "ProductoBase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
