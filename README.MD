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
│   │   └── lote/
│   │       ├── lote.controller.ts
│   │       ├── lote.service.ts
│   │       ├── lote.module.ts
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

# Ejecutar en desarrollo
npm run start:dev
```

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
- `GET /lotes/:id` - Obtener lote por ID con todas sus relaciones
- `POST /lotes` - Crear nuevo lote
- `PATCH /lotes/:id` - Actualizar lote
- `DELETE /lotes/:id` - Eliminar lote

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