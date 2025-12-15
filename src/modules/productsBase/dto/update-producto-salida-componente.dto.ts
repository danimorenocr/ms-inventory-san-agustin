import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateProductoSalidaComponenteDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  productoSalidaId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  subparteBaseId?: number;
}
