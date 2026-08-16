import { IsNumber, IsOptional } from 'class-validator';

export class ConsumeProductoSalidaDto {
  @IsNumber()
  productoSalidaId: number;

  // peso total del producto vendido (ej: 1kg de asadura)
  @IsNumber()
  pesoTotal: number;

  @IsOptional()
  @IsNumber()
  referenciaVentaId?: number;
}
