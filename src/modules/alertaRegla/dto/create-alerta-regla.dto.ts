import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertaReglaDto {
  @ApiProperty({
    description: 'ID del lote asociado',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  loteId?: number;

  @ApiProperty({
    description: 'ID de la categoría de lote asociada',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  categoriaLoteId?: number;

  @ApiProperty({
    description: 'ID de la subparte de lote asociada',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  subparteLoteId?: number;

  @ApiProperty({
    description: 'ID del lote individual asociado',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  loteIndividualId?: number;

  @ApiProperty({
    description: 'ID del producto asociado',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  productoId?: number;

  @ApiProperty({
    description: 'Tipo de alerta',
    enum: ['MINIMO_KG', 'PORCENTAJE', 'TIEMPO'],
    example: 'MINIMO_KG',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['MINIMO_KG', 'PORCENTAJE', 'TIEMPO'])
  tipo: string;

  @ApiProperty({
    description: 'Valor de la regla (ej: 5 kg, 20%, etc.)',
    example: 5.0,
  })
  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @ApiProperty({
    description: 'Indica si la regla está activa',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}
