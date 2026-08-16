import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateProductoSalidaDto {
  @ApiProperty({ example: 'Asadura', required: false })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'kg', required: false })
  @IsOptional()
  @IsString()
  unidad?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
