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
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoteDto {
  @ApiProperty({
    description: 'Tipo de ingreso del lote',
    enum: ['matadero', 'compra_individual'],
    example: 'matadero',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['matadero', 'compra_individual'])
  tipoIngreso: string;

  @ApiProperty({
    description: 'Tipo de animal',
    enum: ['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'],
    example: 'res',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'])
  tipoAnimal: string;

  @ApiProperty({
    description: 'Procedencia del lote',
    example: 'Finca El Paraíso',
    required: false,
  })
  @IsString()
  @IsOptional()
  procedencia?: string;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Juan Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  proveedor?: string;

  @ApiProperty({
    description: 'Indica si tiene guía',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  guia?: boolean;

  @ApiProperty({
    description: 'URL de la foto de la guía',
    example: 'https://example.com/guia.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  fotoGuia?: string;

  @ApiProperty({
    description: 'Peso inicial en kilogramos',
    example: 350.5,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoKgInicial: number;

  @ApiProperty({
    description: 'Peso actual en kilogramos',
    example: 350.5,
  })
  @IsNumber()
  @IsNotEmpty()
  pesoKgActual: number;

  @ApiProperty({
    description: 'Precio por kilogramo',
    example: 12000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precioKg?: number;

  @ApiProperty({
    description: 'Precio por arroba',
    example: 150000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precioArroba?: number;

  @ApiProperty({
    description: 'Indica si el animal está limpio',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  limpio?: boolean;

  @ApiProperty({
    description: 'Sexo del animal',
    enum: ['macho', 'hembra'],
    example: 'macho',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['macho', 'hembra'])
  sexo?: string;

  @ApiProperty({
    description: 'Clasificación del animal',
    example: 'Primera',
    required: false,
  })
  @IsString()
  @IsOptional()
  clasificacion?: string;

  @ApiProperty({
    description: 'Número de dientes del animal',
    example: 4,
    required: false,
  })
  @IsInt()
  @IsOptional()
  dientes?: number;

  @ApiProperty({
    description: 'Fecha de ingreso del lote',
    example: '2025-12-02T10:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaIngreso?: string;

  @ApiProperty({
    description: 'ID del usuario que registra el lote',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idUsuario: number;
}
