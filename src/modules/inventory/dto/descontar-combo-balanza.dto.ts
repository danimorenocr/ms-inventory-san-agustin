export class DescontarComboBalanzaDto {
  /**
   * Peso total del combo medido por la balanza (en kg)
   */
  pesoTotal: number;

  /**
   * Motivo del descuento (ej: "Venta POS", "Venta #123")
   */
  motivo: string;

  /**
   * ID de la venta (opcional)
   */
  ventaId?: number;
}
