import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReservaParaCombosDto {
  @IsNumber()
  cantidad: number; // Cantidad a reservar en kg

  @IsOptional()
  @IsString()
  motivo?: string; // Razón de la reserva
}
