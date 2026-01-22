// export interface Producto {
//   id: number;
//   nombre: string;
//   descripcion?: string;
//   precio: number;
//   cantidad_actual: number;
//   stock_minimo: number;
//   categoria_nombre?: string;
//   marca_nombre?: string;
//   imagen?: string;
// }

export interface Producto {
  id_producto: number;
  nombre: string;

  precio_venta: number;
  cantidad_actual: number;
  stock_minimo: number;

  imagen_url?: string;

  marca_nombre?: string;
  categoria_nombre?: string;
}

