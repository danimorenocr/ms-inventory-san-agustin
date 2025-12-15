import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMovimientoInventarioDto {
  @ApiProperty({ example: 'VENTA', enum: ['VENTA', 'AJUSTE', 'MERMA'] })
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  referenciaId?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  loteId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  subparteLoteId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  subparteBaseId: number;

  @ApiProperty({ example: 2.5 })
  @IsNotEmpty()
  @IsNumber()
  peso: number;
}
