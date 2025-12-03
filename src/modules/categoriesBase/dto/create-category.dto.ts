import { IsString, IsNotEmpty, IsIn, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryBaseDto {
  @ApiProperty({
    description: 'Tipo de animal de la categoría',
    enum: ['res', 'cerdo', 'pollo', 'pescado', 'individual'],
    example: 'res',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['res', 'cerdo', 'pollo', 'pescado', 'individual'])
  tipoAnimal: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'COGOTE',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Estado de la categoría',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}

