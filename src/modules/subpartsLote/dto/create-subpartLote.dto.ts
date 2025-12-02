import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateSubparteLoteDto {
  @IsInt()
  @IsNotEmpty()
  idLote: number;

  @IsInt()
  @IsNotEmpty()
  idCategoriaLote: number;

  @IsInt()
  @IsNotEmpty()
  idSubparteBase: number;

  @IsNumber()
  @IsNotEmpty()
  pesoSubparteKg: number;

  @IsDateString()
  @IsOptional()
  fechaPesado?: string;
}
