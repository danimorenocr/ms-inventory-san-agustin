import { IsNumber, IsOptional, IsArray, IsString } from 'class-validator';

export class ComponenteEspecificadoDto {
  @IsNumber()
  baseId: number;

  @IsNumber()
  peso: number;
}

export class DescontarProductoSalidaDto {
  @IsNumber()
  cantidad: number; // Peso total del producto vendido (kg)

  @IsOptional()
  @IsArray()
  componentes?: ComponenteEspecificadoDto[]; // Componentes específicos (opcional)

  @IsOptional()
  @IsString()
  motivo?: string; // Razón del descuento (ej: "Venta #1", "Ajuste", etc.)

  @IsOptional()
  @IsNumber()
  ventaId?: number; // ID de la venta para auditoría
}
