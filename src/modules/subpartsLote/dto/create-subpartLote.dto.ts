import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubparteLoteDto {
  @ApiProperty({
    description: 'ID del lote',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idLote: number;

  @ApiProperty({
    description: 'ID de la categoría del lote',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idCategoriaLote: number;

  @ApiProperty({
    description: 'ID de la subparte base',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idSubparteBase: number;

  @ApiProperty({
    description: 'Peso de la subparte en kilogramos',
    example: 12.5,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoSubparteKg: number;

  @ApiProperty({
    description: 'Unidades',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  unidades?: number;

  @ApiProperty({
    description: 'Fecha de pesado',
    example: '2025-12-02T10:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaPesado?: string;

  @ApiProperty({ description: "Parte que no llegó (peso 0, requiere imagen)", required: false })
  @IsBoolean()
  @IsOptional()
  faltante?: boolean;

  @ApiProperty({ description: "Descripción de la parte faltante", required: false })
  @IsString()
  @IsOptional()
  faltanteDescripcion?: string;

  @ApiProperty({ description: "Imagen (data URL) de evidencia de la parte faltante", required: false })
  @IsString()
  @IsOptional()
  faltanteImagen?: string;
}
