import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductoSalidaComponenteDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productoSalidaId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  subparteBaseId: number;
}
