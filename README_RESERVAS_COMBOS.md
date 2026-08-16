# Reservas Globales Para Combos

## Objetivo

Evitar el pesaje manual por venta cuando se venden combos.

Con este flujo puedes reservar kg de productos base para combos en general (no solo para un combo puntual) y descontar automaticamente al vender.

Ejemplo:
- Combo: PIERNA BZ
- Componentes permitidos: pierna y brazo
- Reserva global para combos:
  - pierna: 10 kg
  - brazo: 10 kg
- Si vendes 2 kg de PIERNA BZ, el sistema descuenta automatico desde cualquiera de esos componentes segun disponibilidad.

## Cambios de modelo de datos

Se agregaron campos para controlar reservas:

1. En SubparteBase:
- reservaCombosKg
- consumidoCombosKg

2. En ProductoBase:
- reservaCombosKg
- consumidoCombosKg

3. En componentes del ProductoSalida (compatibilidad con flujo previo):
- factorAsignacion en ProductoSalidaComponente
- factorAsignacion en ProductoSalidaComponenteIndividual

## Reglas del descuento automatico

1. Si la venta envia componentes manuales:
- Se respeta exactamente ese desglose.

2. Si la venta no envia componentes manuales:
- El sistema intenta usar primero la reserva global de combos.
- Si hay suficiente reserva disponible, reparte el descuento entre las bases permitidas del combo.
- El consumo se refleja en consumidoCombosKg.
- El inventario fisico se descuenta con FIFO.

3. Si no hay reservas configuradas:
- Se usa el mecanismo de asignacion por factores del combo (factorAsignacion) o reparto por defecto.

## Endpoints para configurar reservas

### Subpartes base

- Crear:
  - POST /subparts-base
- Actualizar:
  - PATCH /subparts-base/:id

Campo permitido:
- reservaCombosKg

Ejemplo:

```json
{
  "reservaCombosKg": 10
}
```

### Productos base

- Crear:
  - POST /products-base
- Actualizar:
  - PATCH /products-base/:id

Campo permitido:
- reservaCombosKg

Ejemplo:

```json
{
  "reservaCombosKg": 10
}
```

## Endpoint de reporte de reservas

Nuevo endpoint:

- GET /productos-salida/reservas-combos/reporte
- GET /productos-salida/reservas-combos/reporte?productoSalidaId=ID

### Que retorna

- productoSalida (si filtras por productoSalidaId)
- totalBases
- resumen:
  - reservaTotalKg
  - consumidoTotalKg
  - disponibleReservaTotalKg
  - stockFisicoTotalKg
- items[] por base:
  - tipoBase
  - baseId
  - nombre
  - reservaKg
  - consumidoKg
  - disponibleReservaKg
  - stockFisicoKg

Ejemplo de respuesta:

```json
{
  "productoSalida": {
    "id": 8,
    "nombre": "PIERNA BZ"
  },
  "totalBases": 2,
  "resumen": {
    "reservaTotalKg": 20,
    "consumidoTotalKg": 6,
    "disponibleReservaTotalKg": 14,
    "stockFisicoTotalKg": 55
  },
  "items": [
    {
      "tipoBase": "subparte",
      "baseId": 10,
      "nombre": "Pierna",
      "reservaKg": 10,
      "consumidoKg": 3,
      "disponibleReservaKg": 7,
      "stockFisicoKg": 30
    },
    {
      "tipoBase": "subparte",
      "baseId": 11,
      "nombre": "Brazo",
      "reservaKg": 10,
      "consumidoKg": 3,
      "disponibleReservaKg": 7,
      "stockFisicoKg": 25
    }
  ]
}
```

## Flujo recomendado en operacion

1. Define componentes permitidos por combo en ProductoSalida.
2. Configura reservaCombosKg en las bases que quieras usar para combos.
3. Vende el combo sin mandar componentes manuales.
4. El sistema descuenta automatico y acumula consumidoCombosKg.
5. Monitorea disponibilidad con el endpoint de reporte.

## Pasos tecnicos despues del cambio

1. Ejecutar migracion de Prisma (si aplica en tu entorno):
- npx prisma migrate dev -n reservas_globales_combos

2. Regenerar cliente Prisma:
- npx prisma generate

## Nota importante

Si en tu base actual no existen aun los campos nuevos, el servicio no podra persistir ni consultar reservas hasta aplicar migracion y generar cliente Prisma.
