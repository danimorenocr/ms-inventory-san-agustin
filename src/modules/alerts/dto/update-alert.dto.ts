import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAlertaDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la alerta se marcó como leída',
  })
  @IsBoolean()
  @IsOptional()
  leida?: boolean;
}

