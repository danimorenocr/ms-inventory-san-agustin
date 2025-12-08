import { PartialType } from '@nestjs/swagger';
import { CreateProvenanceDto } from './create-provenance.dto';

export class UpdateProvenanceDto extends PartialType(CreateProvenanceDto) {}
