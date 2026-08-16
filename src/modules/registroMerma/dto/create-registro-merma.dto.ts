import {
  IsNotEmpty,
  IsNumber,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistroMermaDto {
  @ApiProperty({
    description: 'ID del lote asociado',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idLote: number;

  @ApiProperty({
    description: 'Peso total del lote en kilogramos',
    example: 350.5,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoTotalLoteKg: number;

  @ApiProperty({
    description: 'Peso total de todas las categorías en kilogramos',
    example: 340.2,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoTotalCategoriasKg: number;

  @ApiProperty({
    description: 'Peso total de todas las subpartes en kilogramos',
    example: 330.8,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoTotalSubpartesKg: number;

  @ApiProperty({
    description: 'Porcentaje de merma entre peso inicial del lote y total de categorías',
    example: 2.94,
  })
  @IsNumber()
  @IsNotEmpty()
  porcentajeMermaLote: number;

  @ApiProperty({
    description: 'Porcentaje de merma entre total de categorías y total de subpartes',
    example: 2.76,
  })
  @IsNumber()
  @IsNotEmpty()
  porcentajeMermaCategoria: number;

  @ApiProperty({
    description: 'Porcentaje de merma acumulada total',
    example: 5.61,
  })
  @IsNumber()
  @IsNotEmpty()
  porcentajeMermaSubparte: number;
}
