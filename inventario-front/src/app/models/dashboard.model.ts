
export interface DashboardAlerta {
  producto: string;
  producto_id: number;
  stock_actual: number;
  stock_minimo: number;
  critico: boolean
}

// 💰 Objeto para la card de valor inventario
export interface ValorInventario {
  invertido: number;
  ganado: number;
}

export interface DashboardResumen {
  total_productos: number;
  stock_total: number;
  // valor_inventario: number;
  // Nuevos valores
  valor_invertido: number;
  valor_ganado: number;

  productos_bajo_stock: number;

  // Opcional si luego lo mandas del backend
  alertas: DashboardAlerta[];
}

