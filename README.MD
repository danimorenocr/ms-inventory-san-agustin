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
│   │   └── categoriesBase/
│   │       ├── categories.controller.ts
│   │       ├── categories.service.ts
│   │       ├── categories.module.ts
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