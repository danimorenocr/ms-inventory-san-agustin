import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class AddComponenteSubparteDto {
  @IsNumber()
  @IsInt()
  productoSalidaId: number;

  @IsNumber()
  @IsInt()
  subparteBaseId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  factorAsignacion?: number;
}
