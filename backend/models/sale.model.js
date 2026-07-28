import pool from "../config/db.js";

const findByIdQuery = async (id) => {
  const [ventas] = await pool.query(
    "SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre FROM ventas v LEFT JOIN clientes c ON v.cliente_id = c.id LEFT JOIN usuarios u ON v.usuario_id = u.id WHERE v.id = ?", [id]);
  if (ventas.length === 0) return null;
  const [items] = await pool.query(
    "SELECT dv.*, p.nombre as producto_nombre FROM detalle_ventas dv LEFT JOIN productos p ON dv.producto_id = p.id WHERE dv.venta_id = ?", [id]);
  return { ...ventas[0], items };
};

export const SaleModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre FROM ventas v LEFT JOIN clientes c ON v.cliente_id = c.id LEFT JOIN usuarios u ON v.usuario_id = u.id ORDER BY v.id DESC"
    );
    return rows;
  },
  findById: findByIdQuery,
  create: async ({ cliente_id, usuario_id, items }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [venta] = await conn.query("INSERT INTO ventas (cliente_id, usuario_id) VALUES (?, ?)", [cliente_id || null, usuario_id]);
      const ventaId = venta.insertId;
      let total = 0;
      for (const item of items) {
        const [prod] = await conn.query("SELECT precio, stock FROM productos WHERE id = ? FOR UPDATE", [item.producto_id]);
        if (!prod[0]) throw new Error(`Producto ${item.producto_id} no existe`);
        if (prod[0].stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${item.producto_id}`);
        await conn.query(
          "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
          [ventaId, item.producto_id, item.cantidad, prod[0].precio]
        );
        await conn.query("UPDATE productos SET stock = stock - ? WHERE id = ?", [item.cantidad, item.producto_id]);
        await conn.query(
          "INSERT INTO movimientos_inventario (producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo) VALUES (?, ?, 'salida', ?, ?, ?, ?)",
          [item.producto_id, usuario_id, item.cantidad, prod[0].stock, prod[0].stock - item.cantidad, `Venta #${ventaId}`]
        );
        total += item.cantidad * prod[0].precio;
      }
      await conn.query("UPDATE ventas SET total = ? WHERE id = ?", [total, ventaId]);
      await conn.commit();
      return findByIdQuery(ventaId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM ventas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
