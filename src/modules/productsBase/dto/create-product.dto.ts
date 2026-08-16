import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Ubre',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'vísceras',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    description: 'Estado del producto',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  estado?: boolean;

  @ApiProperty({
    description: 'Kg reservados globalmente para ventas de combos',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reservaCombosKg?: number;
}
