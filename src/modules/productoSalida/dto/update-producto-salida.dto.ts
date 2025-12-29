import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductoSalidaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
