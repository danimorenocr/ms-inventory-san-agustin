import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoSalidaDto {
  @ApiProperty({
    description: 'Nombre del producto de salida',
    example: 'Filetes de res',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Unidad de medida (kg | unidad)',
    example: 'kg',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  unidad: string; // kg | unidad

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 25000,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precio?: number;

  @ApiProperty({
    description: 'Etiqueta del producto',
    example: 'Etiqueta de premium',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  etiqueta?: string;

  @ApiProperty({
    description: 'Estado del producto (activo/inactivo)',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
