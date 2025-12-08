import { PartialType } from '@nestjs/swagger';
import { CreateRegistroMermaDto } from './create-registro-merma.dto';

export class UpdateRegistroMermaDto extends PartialType(CreateRegistroMermaDto) {}
