import { PartialType } from '@nestjs/swagger';
import { CreateSubparteLoteDto } from './create-subpartLote.dto';

export class UpdateSubparteLoteDto extends PartialType(CreateSubparteLoteDto) {}
