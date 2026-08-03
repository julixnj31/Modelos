// ============================================================
// inventory.model.js - Consultas SQL de movimientos de inventario
// Cada movimiento deja el stock anterior y el nuevo para tener
// el historial completo de qué pasó con un producto.
// ============================================================

import pool from "../config/db.js";

export const InventoryModel = {
  // Todo el historial de movimientos, con nombre del producto y del usuario
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT mi.*, p.nombre as producto_nombre, u.nombre as usuario_nombre FROM movimientos_inventario mi LEFT JOIN productos p ON mi.producto_id = p.id LEFT JOIN usuarios u ON mi.usuario_id = u.id ORDER BY mi.id DESC"
    );
    return rows;
  },

  // Registra un movimiento y actualiza el stock del producto.
  // También es una transacción para que no quede a medias.
  create: async ({ producto_id, usuario_id, tipo, cantidad, motivo }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Trae el stock actual (bloqueado para no chocar con otra compra/venta)
      const [prod] = await conn.query("SELECT stock FROM productos WHERE id = ? FOR UPDATE", [producto_id]);
      if (!prod[0]) throw new Error("Producto no existe");
      const stock_anterior = prod[0].stock;

      // Calcula el nuevo stock según el tipo de movimiento:
      let stock_nuevo = stock_anterior;
      if (tipo === 'entrada') stock_nuevo = stock_anterior + cantidad; // Llegó mercancía
      else if (tipo === 'salida') stock_nuevo = stock_anterior - cantidad; // Salió mercancía
      else if (tipo === 'ajuste') stock_nuevo = cantidad; // Corrección manual del conteo

      // No se puede quedar por debajo de cero
      if (stock_nuevo < 0) throw new Error("Stock no puede ser negativo");

      // Guarda el movimiento y actualiza el stock del producto
      await conn.query(
        "INSERT INTO movimientos_inventario (producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo]
      );
      await conn.query("UPDATE productos SET stock = ? WHERE id = ?", [stock_nuevo, producto_id]);

      await conn.commit(); // Todo bien, se guarda
      return { producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo };
    } catch (err) {
      await conn.rollback(); // Fue error: no se deja nada a medias
      throw err;
    } finally {
      conn.release(); // Suelta la conexión
    }
  },
};