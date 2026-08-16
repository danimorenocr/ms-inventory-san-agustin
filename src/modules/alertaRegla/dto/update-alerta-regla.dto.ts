import { PartialType } from '@nestjs/swagger';
import { CreateAlertaReglaDto } from './create-alerta-regla.dto';

export class UpdateAlertaReglaDto extends PartialType(CreateAlertaReglaDto) {}
