export class MovimientoStock {
  id!: number;
  id_producto!: number;
  productoNombre!: string;
  productoMarca!: string;
  cantidad!: number;
  tipo!: 'ENTRADA' | 'SALIDA';
  motivo!: string;
  usuarioNombre!: string;
  fecha!: Date;
  comentario?: string;

  /** 👇 Getter calculado */
  get motivoClase(): string {
    return this.motivo
      .toUpperCase()
      .replace(/\s+/g, '_');
  }
}
