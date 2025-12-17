export interface MovimientoBackend {
  id_movimiento: number;
  producto_nombre: string;
  producto_marca: string;
  cantidad: number;
  tipo_movimiento: 'ENTRADA' | 'SALIDA';
  motivo: string;
  usuario_responsable: string;
  fecha_movimiento: string;
  observaciones?: string;
}
