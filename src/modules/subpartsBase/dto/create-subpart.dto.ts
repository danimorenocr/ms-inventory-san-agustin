

import { IsInt, IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatesubpartDto {
	@IsInt()
	@IsNotEmpty()
	idCategoriaBase: number;

	@IsString()
	@IsNotEmpty()
	nombre: string;

	@IsBoolean()
	@IsOptional()
	estado?: boolean;
}

