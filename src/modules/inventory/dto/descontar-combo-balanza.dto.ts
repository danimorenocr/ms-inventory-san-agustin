import { IsNotEmpty, IsNumber, IsString, IsOptional, IsInt } from 'class-validator';

export class DescontarComboBalanzaDto {
  /**
   * Peso total del combo medido por la balanza (en kg)
   */
  @IsNotEmpty()
  @IsNumber()
  pesoTotal: number;

  /**
   * Motivo del descuento (ej: "Venta POS", "Venta #123")
   */
  @IsNotEmpty()
  @IsString()
  motivo: string;

  /**
   * ID de la venta (opcional)
   */
  @IsOptional()
  @IsInt()
  ventaId?: number;

  /**
   * Unidades opcionales a descontar (ej: si se venden 5 patas)
   */
  @IsOptional()
  @IsInt()
  unidades?: number;
}
