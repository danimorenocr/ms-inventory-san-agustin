import { IsInt, IsNumber } from 'class-validator';

export class AddComponenteSubparteLoteDto {
  @IsNumber()
  @IsInt()
  productoSalidaId: number;

  @IsNumber()
  @IsInt()
  subparteLoteId: number;
}
