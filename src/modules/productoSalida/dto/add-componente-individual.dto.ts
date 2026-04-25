import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class AddComponenteIndividualDto {
  @IsNumber()
  @IsInt()
  productoSalidaId: number;

  @IsNumber()
  @IsInt()
  productoBaseId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  factorAsignacion?: number;
}
