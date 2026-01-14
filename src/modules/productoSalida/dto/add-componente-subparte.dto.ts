import { IsInt, IsNumber } from 'class-validator';

export class AddComponenteSubparteDto {
  @IsNumber()
  @IsInt()
  productoSalidaId: number;

  @IsNumber()
  @IsInt()
  subparteBaseId: number;
}
