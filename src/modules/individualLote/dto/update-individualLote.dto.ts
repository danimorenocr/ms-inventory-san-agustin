import { PartialType } from '@nestjs/swagger';
import { CreateLoteIndividualDto } from './create-individuallote.dto';

export class UpdateLoteIndividualDto extends PartialType(CreateLoteIndividualDto) {}
