import { IsNumber, IsNotEmpty, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ComponenteDescontar {
    @IsNumber()
    @IsNotEmpty()
    subparteBaseId?: number;

    @IsNumber()
    @IsNotEmpty()
    productoBaseId?: number;

    @IsNumber()
    @Min(0)
    peso: number;
}

export class DescontarStockDto {
    @IsNumber()
    @IsNotEmpty()
    productoSalidaId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ComponenteDescontar)
    componentes: ComponenteDescontar[];

    @IsNumber()
    @Min(0)
    pesoTotal: number;
}
