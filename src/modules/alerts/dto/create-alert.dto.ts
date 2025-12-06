import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertaDto {
  @ApiProperty({
    example: 'stock_bajo',
    description: 'Tipo de alerta que se está registrando',
  })
  @IsString()
  tipo: string;

  @ApiProperty({
    example: 'La cantidad de carne está por debajo de 20 kg',
    description: 'Mensaje detallado de la alerta',
  })
  @IsString()
  mensaje: string;
}

