# Sistema de Descuento de Inventario - Bolsa Lógica Unificada

## 📋 Resumen

Este sistema implementa un mecanismo inteligente de descuento de inventario que **unifica** el stock de desposte (`SubparteLote`) y compras individuales (`LoteIndividual`) en una "bolsa lógica" temporal, aplicando **FIFO global** para descontar automáticamente del stock más antiguo, sin importar su origen.

---

## 🔄 Flujo Completo (5 Pasos)

### 1️⃣ **Definir QUÉ se puede consumir** (no cuánto)

Cuando se vende un `ProductoSalida` (ej: "Costilla Premium"), el sistema identifica qué tipos de carne/insumos son válidos:

**A. Por desposte:**
```
ProductoSalida
 → ProductoSalidaComponente
 → SubparteBase (ej: costilla)
```

**B. Por compra individual:**
```
ProductoSalida
 → ProductoSalidaComponenteIndividual
 → ProductoBase (ej: costilla)
```

⚠️ **Aquí NO hay pesos, solo IDs válidos**

---

### 2️⃣ **Buscar el stock REAL** (donde sí hay peso)

**A. SubparteLote (desposte):**
```sql
SELECT * FROM SubparteLote
WHERE idSubparteBase IN (costilla_ids)
  AND pesoSubparteKg > 0
ORDER BY fechaPesado ASC
```

**B. LoteIndividual (compra directa):**
```sql
SELECT * FROM LoteIndividual
WHERE idProductoBase IN (costilla_ids)
  AND pesoKg > 0
ORDER BY fechaRegistro ASC
```

👉 **Aquí aparece el peso, y SOLO aquí**

---

### 3️⃣ **Crear la "bolsa lógica de stock"** (en memoria)

El sistema crea una estructura unificada en memoria:

```typescript
const bolsaStock = [
  {
    origen: 'SUBPARTE_LOTE',
    id: 123,
    baseId: 5,
    pesoDisponible: 15.5,
    fecha: '2026-01-01'
  },
  {
    origen: 'LOTE_INDIVIDUAL',
    id: 456,
    baseId: 7,
    pesoDisponible: 8.2,
    fecha: '2026-01-02'
  }
].sort((a, b) => a.fecha - b.fecha) // FIFO global
```

🧠 **Clave:** Aquí ya no importa de dónde viene, solo:
- ✅ Cuánto hay
- ✅ Qué tan viejo es

---

### 4️⃣ **Descontar peso en cascada** (núcleo del sistema)

```typescript
let restante = 5 // kg a vender

for (const item of bolsaStock) {
  if (restante <= 0) break

  const consumir = Math.min(item.pesoDisponible, restante)

  if (item.origen === 'SUBPARTE_LOTE') {
    // Descontar de SubparteLote
    await prisma.subparteLote.update({
      where: { id: item.id },
      data: { pesoSubparteKg: { decrement: consumir } }
    })

    // Registrar movimiento
    await prisma.movimientoInventario.create({
      data: {
        tipo: 'VENTA',
        subparteLoteId: item.id,
        subparteBaseId: item.baseId,
        peso: consumir
      }
    })
  }

  if (item.origen === 'LOTE_INDIVIDUAL') {
    // Descontar de LoteIndividual
    await prisma.loteIndividual.update({
      where: { idLote: item.id },
      data: { pesoKg: { decrement: consumir } }
    })
  }

  restante -= consumir
}
```

---

### 5️⃣ **Validación final**

```typescript
if (restante > 0) {
  throw new Error(`Stock insuficiente. Faltan ${restante.toFixed(2)} kg`)
}
```

---

## 🔥 Diferencias Clave

| **Antes** | **Ahora** |
|-----------|-----------|
| "¿De dónde resto?" | El sistema decide automáticamente |
| El producto tiene peso | El peso vive en los lotes |
| El frontend decide | El backend manda |
| Lógica duplicada | Motor único centralizado |
| FIFO por tabla | FIFO global unificado |

---

## 📡 Endpoints Disponibles

### 1. **Validar Stock** (antes de vender)

**POST** `/inventory/validate-stock`

```json
{
  "items": [
    {
      "productoSalidaId": 1,
      "pesoRequerido": 5.0
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "missingItems": []
}
```

O si falta stock:
```json
{
  "success": false,
  "missingItems": [
    {
      "productoSalidaId": 1,
      "nombre": "Costilla Premium",
      "requerido": 5.0,
      "disponible": 3.2,
      "faltante": 1.8
    }
  ]
}
```

---

### 2. **Consumir Inventario** (al confirmar venta)

**POST** `/inventory/consume-product`

```json
{
  "productoSalidaId": 1,
  "pesoTotal": 5.0,
  "referenciaVentaId": 123
}
```

**Respuesta:**
```json
{
  "success": true,
  "pesoDescontado": 5.0,
  "productoNombre": "Costilla Premium"
}
```

---

## 🎯 Ejemplo Práctico

### Escenario:
Vender **5 kg** de "Costilla Premium"

### Stock Disponible:
- SubparteLote #1: 3 kg (fecha: 2026-01-01)
- LoteIndividual #2: 4 kg (fecha: 2026-01-03)
- SubparteLote #3: 2 kg (fecha: 2026-01-05)

### Proceso:
1. Sistema crea bolsa lógica ordenada por fecha (FIFO)
2. Consume 3 kg de SubparteLote #1 → restante = 2 kg
3. Consume 2 kg de LoteIndividual #2 → restante = 0 kg
4. ✅ Venta completada

### Resultado:
- SubparteLote #1: 0 kg
- LoteIndividual #2: 2 kg
- SubparteLote #3: 2 kg (sin tocar)

---

## 🔧 Archivos Modificados

1. **`fifo.service.ts`** - Motor principal de descuento
2. **`inventory.service.ts`** - Orquestador de validación y consumo
3. **`validate-stock.dto.ts`** - DTO actualizado para ProductoSalida

---

## ⚠️ Notas Importantes

1. **FIFO Global**: El sistema ordena TODO el stock disponible por fecha, sin importar si viene de desposte o compra individual.

2. **Transacciones**: Cada descuento es atómico. Si falla en medio del proceso, se hace rollback.

3. **Movimientos**: Solo se registran movimientos para `SubparteLote`. Para `LoteIndividual` se necesita crear una tabla `MovimientoInventarioIndividual` (TODO).

4. **Validación Previa**: SIEMPRE validar stock antes de intentar vender para dar feedback al usuario.

---

## 🚀 Próximos Pasos (Recomendados)

1. ✅ Crear tabla `MovimientoInventarioIndividual` para trazabilidad completa
2. ✅ Agregar soporte para unidades (no solo peso)
3. ✅ Implementar alertas de stock bajo
4. ✅ Dashboard de movimientos de inventario
