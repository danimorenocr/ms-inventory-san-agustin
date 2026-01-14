import { IsNumber, IsNotEmpty, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class StockCheckItemDto {
    @IsNumber()
    @IsNotEmpty()
    productoSalidaId: number;

    @IsNumber()
    @Min(0)
    pesoRequerido: number;
}

export class ValidateStockDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StockCheckItemDto)
    items: StockCheckItemDto[];
}
