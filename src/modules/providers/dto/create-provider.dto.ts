import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['res', 'cerdo', 'pollo', 'pescado', 'producto_individual'])
  tipoAnimal: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  ciudad?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['natural', 'juridica'])
  tipoProveedor: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsNotEmpty()
  cedulaNit: string;

  @IsString()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  observacion?: string;
}
