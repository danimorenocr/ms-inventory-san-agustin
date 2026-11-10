import { IsNumber, IsNotEmpty, IsArray, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class StockCheckItemDto {
    @IsNumber()
    @IsNotEmpty()
    productoSalidaId: number;

    @IsNumber()
    @Min(0)
    pesoRequerido: number;

    // Unidades solicitadas (productos que se venden por unidad)
    @IsOptional()
    @IsNumber()
    @Min(0)
    unidadesRequeridas?: number;
}

export class ValidateStockDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StockCheckItemDto)
    items: StockCheckItemDto[];
}
