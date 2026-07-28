import pool from "../config/db.js";

export const InventoryModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT mi.*, p.nombre as producto_nombre, u.nombre as usuario_nombre FROM movimientos_inventario mi LEFT JOIN productos p ON mi.producto_id = p.id LEFT JOIN usuarios u ON mi.usuario_id = u.id ORDER BY mi.id DESC"
    );
    return rows;
  },
  create: async ({ producto_id, usuario_id, tipo, cantidad, motivo }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [prod] = await conn.query("SELECT stock FROM productos WHERE id = ? FOR UPDATE", [producto_id]);
      if (!prod[0]) throw new Error("Producto no existe");
      const stock_anterior = prod[0].stock;
      let stock_nuevo = stock_anterior;
      if (tipo === 'entrada') stock_nuevo = stock_anterior + cantidad;
      else if (tipo === 'salida') stock_nuevo = stock_anterior - cantidad;
      else if (tipo === 'ajuste') stock_nuevo = cantidad;
      if (stock_nuevo < 0) throw new Error("Stock no puede ser negativo");
      await conn.query(
        "INSERT INTO movimientos_inventario (producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo]
      );
      await conn.query("UPDATE productos SET stock = ? WHERE id = ?", [stock_nuevo, producto_id]);
      await conn.commit();
      return { producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
