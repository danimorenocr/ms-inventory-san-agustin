# 🥩 MS-Inventory San Agustín

Microservicio de gestión de inventario para Carnicería San Agustín.

## 📁 Estructura del Proyecto

```
ms-inventory/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── infraestructure/
│   │   └── prisma/
│   ├── modules/
│   │   ├── categoriesBase/
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── categories.module.ts
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   ├── subpartsBase/
│   │   │   ├── subparts.controller.ts
│   │   │   ├── subparts.service.ts
│   │   │   ├── subparts.module.ts
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   ├── productsBase/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── products.module.ts
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   ├── lote/
│   │   │   ├── lote.controller.ts
│   │   │   ├── lote.service.ts
│   │   │   ├── lote.module.ts
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   ├── categoriesLote/
│   │   │   ├── categorielote.controller.ts
│   │   │   ├── categorielote.service.ts
│   │   │   ├── categorielote.module.ts
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   ├── subpartsLote/
│   │   │   ├── subpartsLote.controller.ts
│   │   │   ├── subpartsLote.service.ts
│   │   │   ├── subpartsLote.module.ts
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   ├── individualLote/
│   │   │   ├── individualLote.controller.ts
│   │   │   ├── individualLote.service.ts
│   │   │   ├── individualLote.module.ts
│   │   │   ├── dto/
│   │   │   └── repository/
│   │   └── providers/
│   │       ├── provider.controller.ts
│   │       ├── provider.service.ts
│   │       ├── provider.module.ts
│   │       ├── dto/
│   │       └── repository/
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .gitignore
└── package.json
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar .env
DATABASE_URL="postgresql://usuario:password@localhost:5432/db_name?schema=public"
PORT=3000

# Configurar Prisma
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

#Borrar bd y volver a cargar todo 
npx prisma migrate reset --force


# Ejecutar en desarrollo
npm run start:dev
```


npx prisma generate --schema=./prisma/schema.local.prisma
## 📚 API Endpoints

### Categorías Base (`/categories-base`)

- `GET /categories-base` - Listar categorías activas
- `GET /categories-base?tipoAnimal=res` - Filtrar por tipo de animal
- `GET /categories-base/:id` - Obtener categoría por ID
- `POST /categories-base` - Crear nueva categoría
- `PATCH /categories-base/:id` - Actualizar categoría
- `DELETE /categories-base/:id` - Desactivar categoría (soft delete)
- `DELETE /categories-base/:id/hard` - Eliminar permanentemente

### Subpartes Base (`/subparts-base`)

- `GET /subparts-base` - Listar subpartes activas
- `GET /subparts-base?tipoAnimal=res` - Filtrar por tipo de animal
- `GET /subparts-base/:id` - Obtener subparte por ID
- `POST /subparts-base` - Crear nueva subparte
- `PATCH /subparts-base/:id` - Actualizar subparte
- `DELETE /subparts-base/:id` - Desactivar subparte (soft delete)
- `DELETE /subparts-base/:id/hard` - Eliminar permanentemente

### Productos Base (`/products-base`)

- `GET /products-base` - Listar productos activos
- `GET /products-base?categoria=visceras` - Filtrar por categoría
- `GET /products-base/:id` - Obtener producto por ID
- `POST /products-base` - Crear nuevo producto
- `PATCH /products-base/:id` - Actualizar producto
- `DELETE /products-base/:id` - Desactivar producto (soft delete)
- `DELETE /products-base/:id/hard` - Eliminar permanentemente

### Lotes (`/lotes`)

- `GET /lotes` - Listar todos los lotes
- `GET /lotes?tipoAnimal=res` - Filtrar por tipo de animal
- `GET /lotes?tipoIngreso=matadero` - Filtrar por tipo de ingreso
- `GET /lotes?proveedorId=1` - Filtrar por ID de proveedor
- `GET /lotes/:id` - Obtener lote por ID con todas sus relaciones (incluye proveedor)
- `POST /lotes` - Crear nuevo lote (requiere proveedorId y precioTotal)
- `PATCH /lotes/:id` - Actualizar lote
- `DELETE /lotes/:id` - Eliminar lote

### Categorías de Lote (`/categorias-lote`)

- `GET /categorias-lote` - Listar todas las categorías de lote
- `GET /categorias-lote?idLote=1` - Filtrar por ID de lote
- `GET /categorias-lote?idCategoriaBase=2` - Filtrar por ID de categoría base
- `GET /categorias-lote/:id` - Obtener categoría de lote por ID
- `POST /categorias-lote` - Crear nueva categoría de lote
- `PATCH /categorias-lote/:id` - Actualizar categoría de lote
- `DELETE /categorias-lote/:id` - Eliminar categoría de lote

### Subpartes de Lote (`/subpartes-lote`)

- `GET /subpartes-lote` - Listar todas las subpartes de lote
- `GET /subpartes-lote?idLote=1` - Filtrar por ID de lote
- `GET /subpartes-lote?idCategoriaLote=1` - Filtrar por ID de categoría de lote
- `GET /subpartes-lote?idSubparteBase=1` - Filtrar por ID de subparte base
- `GET /subpartes-lote/:id` - Obtener subparte de lote por ID
- `POST /subpartes-lote` - Crear nueva subparte de lote
- `PATCH /subpartes-lote/:id` - Actualizar subparte de lote
- `DELETE /subpartes-lote/:id` - Eliminar subparte de lote

### Lotes Individuales (`/lotes-individuales`)

- `GET /lotes-individuales` - Listar todos los lotes individuales
- `GET /lotes-individuales?idProductoBase=1` - Filtrar por ID de producto base
- `GET /lotes-individuales/:idLote` - Obtener lote individual por ID de lote
- `POST /lotes-individuales` - Crear nuevo lote individual
- `PATCH /lotes-individuales/:idLote` - Actualizar lote individual
- `DELETE /lotes-individuales/:idLote` - Eliminar lote individual

### Proveedores (`/providers`)

- `GET /providers` - Listar todos los proveedores
- `GET /providers?tipoAnimal=res` - Filtrar por tipo de animal (res, cerdo, pollo, pescado, producto_individual)
- `GET /providers?tipoProveedor=natural` - Filtrar por tipo de proveedor (natural, juridica)
- `GET /providers/:id` - Obtener proveedor por ID
- `POST /providers` - Crear nuevo proveedor
- `PATCH /providers/:id` - Actualizar proveedor
- `DELETE /providers/:id` - Eliminar proveedor

### Alertas (`/alertas`)

- `GET /alertas` - Listar todas las alertas
- `GET /alertas?noLeidas=true` - Filtrar solo alertas no leídas
- `GET /alertas?tipo=stock_bajo` - Filtrar por tipo de alerta
- `GET /alertas/:id` - Obtener alerta por ID
- `POST /alertas` - Crear nueva alerta
- `PATCH /alertas/:id` - Actualizar alerta
- `PATCH /alertas/:id/marcar-leida` - Marcar alerta como leída
- `PATCH /alertas/marcar-todas-leidas` - Marcar todas las alertas como leídas
- `DELETE /alertas/:id` - Eliminar alerta
- `DELETE /alertas` - Eliminar todas las alertas

**Documentación completa:** `http://localhost:3000/api/docs`

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run start:dev

# Prisma
npx prisma studio          # Ver base de datos
npx prisma migrate reset   # Resetear BD
npx prisma format          # Formatear schema
```