import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateLoteDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['matadero', 'compra_individual'])
  tipoIngreso: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'])
  tipoAnimal: string;

  @IsString()
  @IsOptional()
  procedencia?: string;

  @IsString()
  @IsOptional()
  proveedor?: string;

  @IsBoolean()
  @IsOptional()
  guia?: boolean;

  @IsString()
  @IsOptional()
  fotoGuia?: string;

  @IsNumber()
  @IsNotEmpty()
  pesoKgInicial: number;

  @IsNumber()
  @IsNotEmpty()
  pesoKgActual: number;

  @IsNumber()
  @IsOptional()
  precioKg?: number;

  @IsNumber()
  @IsOptional()
  precioArroba?: number;

  @IsBoolean()
  @IsOptional()
  limpio?: boolean;

  @IsString()
  @IsOptional()
  @IsIn(['macho', 'hembra'])
  sexo?: string;

  @IsString()
  @IsOptional()
  clasificacion?: string;

  @IsInt()
  @IsOptional()
  dientes?: number;

  @IsDateString()
  @IsOptional()
  fechaIngreso?: string;

  @IsInt()
  @IsNotEmpty()
  idUsuario: number;
}
