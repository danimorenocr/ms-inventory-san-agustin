# 📊 Logs del Sistema de Descuento de Inventario

## 🎯 Descripción

El sistema ahora incluye **logs detallados** en la consola del backend para rastrear exactamente de qué lotes se está descontando el inventario.

---

## 🟢 Logs de Validación de Stock

Cuando el POS valida si hay stock suficiente antes de proceder al pago:

```
🟢 ========== VALIDACIÓN DE STOCK ==========
📋 Validando 2 producto(s)

🔍 Validando ProductoSalidaId: 1
   Peso requerido: 2.5 kg
   ✅ Producto: "Costilla Premium"
   📋 SubparteBase IDs: [3, 5]
   📋 ProductoBase IDs: [7]
   📊 Stock disponible:
      🥩 SubparteLote: 15.30 kg
      🛒 LoteIndividual: 8.20 kg
      📦 TOTAL: 23.50 kg
   ✅ Stock suficiente

🔍 Validando ProductoSalidaId: 2
   Peso requerido: 1.0 kg
   ✅ Producto: "Chuleta Especial"
   📋 SubparteBase IDs: [4]
   📋 ProductoBase IDs: []
   📊 Stock disponible:
      🥩 SubparteLote: 0.50 kg
      🛒 LoteIndividual: 0.00 kg
      📦 TOTAL: 0.50 kg
   ❌ STOCK INSUFICIENTE - Faltan 0.50 kg

📊 Resultado: ❌ STOCK INSUFICIENTE
   Productos con faltante: 1
🟢 ========== FIN VALIDACIÓN ==========
```

---

## 🔵 Logs de Descuento de Inventario

Cuando se confirma la venta y se descuenta el inventario:

```
🔵 ========== INICIO DESCUENTO DE INVENTARIO ==========
📦 ProductoSalidaId: 1
⚖️  Peso Necesario: 2.5 kg
🔗 Referencia Venta ID: 123

1️⃣ Buscando componentes del producto...
✅ Producto: "Costilla Premium"
   📋 SubparteBase IDs: [3, 5]
   📋 ProductoBase IDs: [7]

2️⃣ Buscando stock disponible...
   🥩 SubparteLote encontrados: 3
      1. ID: 45 | Peso: 5.2 kg | Fecha: 2026-01-01T10:30:00.000Z
      2. ID: 52 | Peso: 3.8 kg | Fecha: 2026-01-03T14:20:00.000Z
      3. ID: 61 | Peso: 6.3 kg | Fecha: 2026-01-05T09:15:00.000Z
   🛒 LoteIndividual encontrados: 2
      1. ID: 12 | Peso: 4.5 kg | Fecha: 2026-01-02T11:00:00.000Z
      2. ID: 18 | Peso: 3.7 kg | Fecha: 2026-01-04T16:45:00.000Z

3️⃣ Creando bolsa lógica unificada (FIFO global)...
   📊 Total items en bolsa: 5
   📅 Orden FIFO (más antiguo primero):
      1. [SUBPARTE_LOTE] ID: 45 | Peso: 5.2 kg | Fecha: 2026-01-01T10:30:00.000Z
      2. [LOTE_INDIVIDUAL] ID: 12 | Peso: 4.5 kg | Fecha: 2026-01-02T11:00:00.000Z
      3. [SUBPARTE_LOTE] ID: 52 | Peso: 3.8 kg | Fecha: 2026-01-03T14:20:00.000Z
      4. [LOTE_INDIVIDUAL] ID: 18 | Peso: 3.7 kg | Fecha: 2026-01-04T16:45:00.000Z
      5. [SUBPARTE_LOTE] ID: 61 | Peso: 6.3 kg | Fecha: 2026-01-05T09:15:00.000Z

4️⃣ Descontando en cascada...

   🔄 Procesando item 1:
      Origen: SUBPARTE_LOTE
      ID: 45
      Disponible: 5.2 kg
      A consumir: 2.5 kg
      Restante después: 2.7 kg
      ✅ Descontado de SubparteLote ID: 45
      📝 Movimiento registrado
      ⚖️  Restante por descontar: 0.000 kg

5️⃣ Validación final...
   ✅ DESCUENTO EXITOSO
   Total descontado: 2.5 kg
   Items procesados: 1
🔵 ========== FIN DESCUENTO DE INVENTARIO ==========
```

---

## 📋 Información que Muestran los Logs

### **Validación de Stock:**
- ✅ Producto que se está validando
- 📋 IDs de SubparteBase y ProductoBase que componen el producto
- 📊 Stock disponible separado por fuente:
  - 🥩 SubparteLote (desposte)
  - 🛒 LoteIndividual (compra directa)
  - 📦 Total combinado
- ✅/❌ Si hay suficiente stock o cuánto falta

### **Descuento de Inventario:**
- 📦 Producto y peso a descontar
- 🔗 ID de referencia de la venta
- 📋 Componentes del producto
- 🥩 Todos los SubparteLote disponibles con:
  - ID del lote
  - Peso disponible
  - Fecha de pesado
- 🛒 Todos los LoteIndividual disponibles con:
  - ID del lote
  - Peso disponible
  - Fecha de registro
- 📅 **Orden FIFO global** (más antiguo primero)
- 🔄 Para cada item descontado:
  - Origen (SUBPARTE_LOTE o LOTE_INDIVIDUAL)
  - ID específico del lote
  - Peso disponible antes
  - Peso consumido
  - Peso restante después
  - Si se registró el movimiento
- ✅ Resultado final del descuento

---

## 🔍 Cómo Ver los Logs

1. **Abre la terminal** donde está corriendo `ms-inventory`
2. **Realiza una venta** desde el POS
3. **Observa los logs** en la consola

Los logs aparecerán en **dos momentos**:

1. **Al presionar "Pagar"** (F9) → Logs de validación 🟢
2. **Al confirmar el pago** → Logs de descuento 🔵

---

## 💡 Ejemplo de Uso

### Escenario: Vender 3 kg de "Costilla Premium"

**Stock disponible:**
- SubparteLote #45: 2 kg (01-ene)
- LoteIndividual #12: 5 kg (02-ene)
- SubparteLote #52: 4 kg (03-ene)

**Logs mostrarán:**
```
Orden FIFO:
1. [SUBPARTE_LOTE] ID: 45 | 2 kg
2. [LOTE_INDIVIDUAL] ID: 12 | 5 kg
3. [SUBPARTE_LOTE] ID: 52 | 4 kg

Descontando:
Item 1: Consumir 2 kg de SubparteLote #45
Item 2: Consumir 1 kg de LoteIndividual #12
✅ Total: 3 kg descontados
```

---

## 🎯 Beneficios de los Logs

1. **Trazabilidad Completa**: Sabes exactamente de qué lote salió cada kg
2. **Debugging Fácil**: Si algo falla, ves dónde
3. **Auditoría**: Registro detallado de cada operación
4. **FIFO Verificable**: Confirmas que se usa el stock más antiguo primero
5. **Transparencia**: Ves cómo el sistema combina desposte + compras individuales

---

## ⚠️ Notas

- Los logs solo aparecen en **desarrollo** (consola del backend)
- En **producción**, considera usar un sistema de logging profesional (Winston, Pino, etc.)
- Los logs incluyen **emojis** para facilitar la lectura visual
- Cada operación tiene un **separador claro** para distinguir inicio y fin
