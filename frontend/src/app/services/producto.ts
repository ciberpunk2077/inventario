export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  imagen: string;
  imagen_url: string;
  cantidad_actual: number;
  categoria_nombre: string;
  marca?: number;
  marca_nombre?: string;
}
