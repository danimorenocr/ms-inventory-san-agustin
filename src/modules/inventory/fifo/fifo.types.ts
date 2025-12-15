export interface ConsumeFIFOInput {
  subparteBaseId: number;
  peso: number;
  referencia?: {
    tipo: 'VENTA' | 'AJUSTE' | 'MERMA';
    id?: number;
  };
}

export interface FIFOResult {
  consumido: number;
  detalle: {
    subparteLoteId: number;
    loteId: number;
    peso: number;
  }[];
}
