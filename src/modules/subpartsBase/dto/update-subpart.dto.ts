
import { PartialType } from '@nestjs/swagger';
import { CreatesubpartDto } from './create-subpart.dto';

export class UpdatesubpartDto extends PartialType(CreatesubpartDto) {}
