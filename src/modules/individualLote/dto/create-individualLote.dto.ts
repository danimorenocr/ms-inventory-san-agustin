import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoteIndividualDto {
  @ApiProperty({
    description: 'ID del lote',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idLote: number;

  @ApiProperty({
    description: 'ID del producto base',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idProductoBase: number;

  @ApiProperty({
    description: 'Peso en kilogramos',
    example: 5.5,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoKg: number;

  @ApiProperty({
    description: 'Precio por kilogramo',
    example: 15000,
  })
  @IsNumber()
  @IsNotEmpty()
  precioKg: number;

  @ApiProperty({
    description: 'Precio total del lote individual',
    example: 82500,
  })
  @IsNumber()
  @IsNotEmpty()
  precioTotal: number;

  @ApiProperty({
    description: 'Fecha de registro',
    example: '2025-12-02T10:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaRegistro?: string;

  @ApiProperty({
    description: 'Unidades',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  unidades?: number;
}
