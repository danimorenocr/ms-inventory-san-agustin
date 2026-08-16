import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProvenanceDto {
	@ApiProperty({ example: 'Finca El Roble', description: 'Nombre de la procedencia' })
	@IsString()
	@IsNotEmpty()
	nombre: string;
}
