import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaLoteDto } from './create-categorielote.dto';

export class UpdateCategoriaLoteDto extends PartialType(CreateCategoriaLoteDto) {}
