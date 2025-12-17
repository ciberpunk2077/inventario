import { MovimientoBackend } from '../movimiento-backend.model';
import { MovimientoStock } from '../movimiento-stock.model';


export class MovimientoMapper {

  static fromBackend(m: MovimientoBackend): MovimientoStock {
    return Object.assign(new MovimientoStock(), {
      id: m.id_movimiento,
      productoNombre: m.producto_nombre,
      productoMarca: m.producto_marca,
      cantidad: m.cantidad,
      tipo: m.tipo_movimiento,
      motivo: m.motivo,
      usuarioNombre: m.usuario_responsable,
      fecha: new Date(m.fecha_movimiento),
      comentario: m.observaciones
    });
  }

  static fromBackendList(list: MovimientoBackend[]): MovimientoStock[] {
    return list.map(this.fromBackend);
  }
}
