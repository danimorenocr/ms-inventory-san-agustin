import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductoSalidaDto {
  @IsString()
  nombre: string;

  @IsString()
  unidad: string; // kg | unidad

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
