import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateProductoSalidaComponenteDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  productoSalidaId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  subparteBaseId?: number;

  @ApiProperty({ example: 0.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  factorAsignacion?: number;
}
