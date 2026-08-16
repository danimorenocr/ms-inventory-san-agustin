import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductoSalidaDto {
  @ApiProperty({ example: 'Asadura' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'kg' })
  @IsNotEmpty()
  @IsString()
  unidad: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
