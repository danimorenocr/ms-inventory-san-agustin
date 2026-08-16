# 🥩 MS-Inventory - Carnes San Agustín

Microservicio de gestión de inventarios, categorías de carne, subpartes de animales, lotes de matadero y proveedores para Carnicería San Agustín. Construido con NestJS, Prisma ORM y PostgreSQL.

---

## 🛠️ Integración Offline & Electron

Este microservicio se integra en la suite **GOLDEN POS** mediante Electron.
*   **Gestión de Datos**: Admite tanto base de datos relacional PostgreSQL en servidor como bases locales para despliegue offline.
*   **Esquema Local**: Utiliza el esquema local de Prisma para la generación de base de datos embebida:
    ```bash
    npx prisma generate --schema=./prisma/schema.local.prisma
    ```
*   **Base de datos de desarrollo (Reset completo)**:
    ```bash
    npx prisma migrate reset --force
    ```

---

## 📁 Estructura del Proyecto

```
ms-inventory/
 ├── prisma/
 │    ├── schema.prisma           # Esquema de base de datos para producción
 │    └── schema.local.prisma     # Esquema para base de datos local
 ├── src/
 │    ├── infraestructure/
 │    │    └── prisma/            # Conector del servicio Prisma
 │    ├── modules/
 │    │    ├── categoriesBase/    # Categorías genéricas (Res, Cerdo, etc.)
 │    │    ├── subpartsBase/      # Despiece base del animal
 │    │    ├── productsBase/      # Productos finales a la venta
 │    │    ├── lote/              # Lotes ingresados del matadero o compras
 │    │    ├── categoriesLote/    # Categorías vinculadas a un lote
 │    │    ├── subpartsLote/      # Subpartes despiezadas vinculadas al lote
 │    │    ├── individualLote/    # Inventario individual de productos
 │    │    └── providers/         # Proveedores de carne y productos
 │    ├── app.module.ts
 │    └── main.ts
```

---

## ⚙️ Configuración del Entorno de Desarrollo

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```
2.  **Configurar variables de entorno (`.env`)**:
    ```env
    PORT=3002
    DATABASE_URL="postgresql://usuario:password@localhost:5432/db_inventory?schema=public"
    ```
3.  **Generar el cliente y migrar base de datos**:
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

---

## 📡 Endpoints de la API

*   `/categories-base` - Categorías Base del inventario.
*   `/subparts-base` - Gestión de despiece del animal.
*   `/products-base` - Productos listos para el punto de venta.
*   `/lotes` - Gestión de lotes de carne procedentes de mataderos.
*   `/categorias-lote` - Categorías asociadas a lotes.
*   `/subpartes-lote` - Despiece asociado a lotes.
*   `/lotes-individuales` - Control detallado de inventario unitario.
*   `/providers` - Catálogo de proveedores.
*   `/alertas` - Alertas automáticas de stock bajo y notificaciones.

> 📚 **Documentación completa (Swagger)**: `http://localhost:3002/api/docs`
## 🗄️ Manual para la configuración y actualización de Base de Datos

El sistema maneja una arquitectura con una base de datos remota (cloud) y otra local (offline-first). Por tanto, en este microservicio existen **dos schemas de Prisma**:
- `prisma/schema.prisma` (Base de datos remota / Cliente normal de Prisma)
- `prisma/schema.local.prisma` (Base de datos local / Cliente local de Prisma)

**Cada vez que necesites realizar un cambio en la base de datos (agregar tablas, columnas, etc.), DEBES seguir estrictamente estos pasos:**

### 1. Actualizar ambos Schemas
Si agregas un modelo o campo en `schema.prisma`, debes **copiar** esos mismos cambios exactamente a `schema.local.prisma`. Deben ser un espejo uno del otro (excepto por la directiva `output` en el `client` local).

### 2. Sincronizar y aplicar los cambios (Push)
Abre una terminal en la carpeta del microservicio y aplica los cambios en ambas bases de datos:

```bash
# 2.1 Aplicar cambios en la base de datos remota (Cloud)
npx prisma db push --schema=prisma/schema.prisma

# 2.2 Aplicar cambios en la base de datos local
npx prisma db push --schema=prisma/schema.local.prisma
```

### 3. Generar los clientes de Prisma
Finalmente, debes regenerar el código autogenerado para que TypeScript reconozca los nuevos campos y el `SyncService` funcione correctamente:

```bash
# 3.1 Generar cliente normal (@prisma/client)
npx prisma generate --schema=prisma/schema.prisma

# 3.2 Generar cliente local (@prisma/client-local)
npx prisma generate --schema=prisma/schema.local.prisma
```

---

## 🐷 Solución de Sincronización de Partes del Cerdo (Cortes Primarios)

Dado que el módulo de desposte originalmente registraba el Cerdo únicamente como Categoría (sin Subpartes), se diseñó un script para clonar cada `CategoriaBase` del cerdo como una `SubparteBase` equivalente, permitiendo así que el sistema de ventas y la creación de productos reconozcan el inventario.

Si estás configurando este repositorio en una base de datos local nueva, **debes ejecutar el siguiente script para migrar y habilitar el cerdo en el módulo de ventas**:

```bash
node fix_cerdo_subpartes.js
```
Este comando recorrerá las categorías del cerdo, creará sus subpartes equivalentes y trasladará el peso registrado en el inventario actual.
