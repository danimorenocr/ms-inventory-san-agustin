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