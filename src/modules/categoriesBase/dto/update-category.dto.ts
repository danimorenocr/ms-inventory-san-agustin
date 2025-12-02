import { PartialType } from '@nestjs/swagger';
import { CreateCategoryBaseDto } from './create-category.dto';

export class UpdateCategoryBaseDto extends PartialType(CreateCategoryBaseDto) {}
