import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCategoriaLoteDto {
  @IsInt()
  @IsNotEmpty()
  idLote: number;

  @IsInt()
  @IsNotEmpty()
  idCategoriaBase: number;

  @IsNumber()
  @IsNotEmpty()
  pesoCategoriaKg: number;

  @IsDateString()
  @IsOptional()
  fechaRegistro?: string;
}
