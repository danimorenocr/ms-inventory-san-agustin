import { IsInt, IsNumber } from 'class-validator';

export class AddComponenteIndividualDto {
  @IsNumber()
  @IsInt()
  productoSalidaId: number;

  @IsNumber()
  @IsInt()
  productoBaseId: number;
}
