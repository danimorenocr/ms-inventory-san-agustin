import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductoSalidaComponenteDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productoSalidaId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  subparteBaseId: number;

  @ApiProperty({ example: 0.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  factorAsignacion?: number;
}
