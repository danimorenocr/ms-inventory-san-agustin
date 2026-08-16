import { PartialType } from '@nestjs/swagger';
import { CreateProductoSalidaDto } from './create-producto-salida.dto';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductoSalidaDto extends PartialType(CreateProductoSalidaDto) {
  @ApiProperty({
    description: 'Nombre del producto de salida',
    example: 'Filetes de res',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    description: 'Unidad de medida (kg | unidad)',
    example: 'kg',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  unidad?: string;

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
