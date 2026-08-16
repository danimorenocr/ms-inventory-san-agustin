import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaLoteDto {
  @ApiProperty({
    description: 'ID del lote',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idLote: number;

  @ApiProperty({
    description: 'ID de la categoría base',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idCategoriaBase: number;

  @ApiProperty({
    description: 'Peso de la categoría en kilogramos',
    example: 50.5,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoCategoriaKg: number;

  @ApiProperty({
    description: 'Fecha de registro',
    example: '2025-12-02T10:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaRegistro?: string;
}
