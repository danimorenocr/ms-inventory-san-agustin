import { PartialType } from '@nestjs/swagger';
import { CreateProductoSalidaDto } from './create-producto-salida.dto';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
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
