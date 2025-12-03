

import { IsInt, IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatesubpartDto {
	@ApiProperty({
		description: 'ID de la categoría base a la que pertenece',
		example: 1,
	})
	@IsInt()
	@IsNotEmpty()
	idCategoriaBase: number;

	@ApiProperty({
		description: 'Nombre de la subparte',
		example: 'Bola de brazo',
	})
	@IsString()
	@IsNotEmpty()
	nombre: string;

	@ApiProperty({
		description: 'Estado de la subparte',
		default: true,
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	estado?: boolean;
}

