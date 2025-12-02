# 🥩 MS-Inventory San Agustín

Microservicio de gestión de inventario para Carnicería San Agustín.

## 📁 Estructura del Proyecto

```
ms-inventory/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.ts            # Datos iniciales
├── src/
│   ├── infraestructure/
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   ├── modules/
│   │   └── categories/
│   │       ├── categories.controller.ts
│   │       ├── categories.service.ts
│   │       ├── categories.module.ts
│   │       ├── dto/
│   │       │   ├── create-category.dto.ts
│   │       │   └── update-category.dto.ts
│   │       └── repository/
│   │           └── categories.repository.ts
│   ├── app.module.ts
│   └── main.ts
├── .env                   # Variables de entorno (NO SUBIR A GIT)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.MD
```

## 🚀 Instalación Paso a Paso

### Opción 1: Instalación Automática (Recomendada)

Si ya tienes el `package.json` configurado:

```bash
# Instalar todas las dependencias automáticamente
npm install
```

Esto instalará todas las dependencias listadas en el `package.json`.

### Opción 2: Instalación Manual (Desde Cero)

#### 1. Inicializar proyecto

```bash
npm init -y
```

#### 2. Instalar dependencias principales

```bash
# NestJS core
npm i @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs

# Prisma y cliente de PostgreSQL
npm install prisma@6 @prisma/client@6

# Validaciones DTO
npm i class-validator class-transformer
```

#### 3. Instalar dependencias de desarrollo

```bash
# TypeScript y herramientas
npm i -D typescript ts-node-dev @types/node

# NestJS CLI (opcional pero recomendado)
npm i -D @nestjs/cli
```

## ⚙️ Configuración de Variables de Entorno

### 1. Crear archivo `.env` en la raíz del proyecto

```
ms-inventory/
├── .env          👈 CREAR AQUÍ
├── prisma/
├── src/
└── package.json
```

### 2. Contenido del archivo `.env`

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos?schema=public"

# Application
PORT=3000
NODE_ENV=development
```

**Ejemplo real:**
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/carniceria_inventory?schema=public"
PORT=3000
NODE_ENV=development
```

⚠️ **IMPORTANTE:** El archivo `.env` ya está en `.gitignore` y NO se debe subir a Git.

## 🗄️ Configuración de Prisma

### 1. Inicializar Prisma (si no existe)

```bash
npx prisma init
```

### 2. Configurar `package.json` para seed

Agregar esta sección en `package.json`:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### 3. Crear la base de datos y ejecutar migraciones

```bash
npx prisma migrate dev --name init
```

### 4. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 5. Ejecutar seed (datos iniciales)

```bash
npx prisma db seed
```

## 🏃‍♂️ Ejecutar el Proyecto

### Modo desarrollo

```bash
npm run start:dev
```

### Modo producción

```bash
npm run build
npm run start:prod
```

## 📝 Comandos Útiles

```bash
# Ver base de datos en navegador
npx prisma studio

# Resetear base de datos
npx prisma migrate reset

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Formatear schema.prisma
npx prisma format
```

## 🔧 Troubleshooting

### Error: "Prisma Client no encontrado"
```bash
npx prisma generate
```

### Error de conexión a base de datos
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos exista

### Error en seed
- Asegurar que `package.json` tenga configurado prisma.seed
- Verificar que `ts-node` esté instalado
- Ejecutar `npx prisma generate` antes del seed