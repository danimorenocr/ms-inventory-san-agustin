import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateLoteIndividualDto {
  @IsInt()
  @IsNotEmpty()
  idLote: number;

  @IsInt()
  @IsNotEmpty()
  idProductoBase: number;

  @IsNumber()
  @IsNotEmpty()
  pesoKg: number;

  @IsNumber()
  @IsNotEmpty()
  precioKg: number;

  @IsDateString()
  @IsOptional()
  fechaRegistro?: string;
}
