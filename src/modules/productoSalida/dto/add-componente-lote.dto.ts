import { IsInt, IsNumber } from 'class-validator';

export class AddComponenteLoteDto {
  @IsNumber()
  @IsInt()
  productoSalidaId: number;

  @IsNumber()
  @IsInt()
  loteId: number;
}
