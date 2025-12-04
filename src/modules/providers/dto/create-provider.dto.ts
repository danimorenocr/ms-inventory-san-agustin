import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Ganadería El Paraíso',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Tipo de animal que provee',
    enum: ['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'],
    example: 'res',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'])
  tipoAnimal: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '3001234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({
    description: 'Ciudad del proveedor',
    example: 'Bogotá',
    required: false,
  })
  @IsString()
  @IsOptional()
  ciudad?: string;

  @ApiProperty({
    description: 'Tipo de proveedor',
    enum: ['natural', 'juridica'],
    example: 'natural',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['natural', 'juridica'])
  tipoProveedor: string;

  @ApiProperty({
    description: 'Dirección del proveedor',
    example: 'Calle 123 # 45-67',
    required: false,
  })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({
    description: 'Cédula o NIT del proveedor',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  cedulaNit: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'contacto@ganaderia.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  correo?: string;

  @ApiProperty({
    description: 'Observaciones adicionales',
    example: 'Proveedor confiable, entregas puntuales',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacion?: string;
}
