import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateMovimientoInventarioDto {
  @ApiProperty({ example: 'VENTA', enum: ['VENTA', 'AJUSTE', 'MERMA'], required: false })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  referenciaId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  loteId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  subparteLoteId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  subparteBaseId?: number;

  @ApiProperty({ example: 2.5, required: false })
  @IsOptional()
  @IsNumber()
  peso?: number;
}
