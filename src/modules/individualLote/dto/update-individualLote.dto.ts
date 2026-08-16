import { PartialType } from '@nestjs/swagger';
import { CreateLoteIndividualDto } from './create-individualLote.dto';

export class UpdateLoteIndividualDto extends PartialType(CreateLoteIndividualDto) {}
