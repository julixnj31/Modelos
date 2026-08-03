// ============================================================
// sale.model.js - Consultas SQL de ventas (la parte más delicada)
// Aquí se crea la venta y al mismo tiempo se descuenta el stock,
// por eso se usa una "transacción": si algo falla, no queda a medias.
// ============================================================

import pool from "../config/db.js";

// Trae una venta con el nombre del cliente y del vendedor, y su detalle.
// "Detalle" = la lista de productos que se vendieron en esa venta.
const findByIdQuery = async (id) => {
  // Primero la venta en sí
  const [ventas] = await pool.query(
    "SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre FROM ventas v LEFT JOIN clientes c ON v.cliente_id = c.id LEFT JOIN usuarios u ON v.usuario_id = u.id WHERE v.id = ?", [id]);
  if (ventas.length === 0) return null;
  // Luego cada producto de la venta (el detalle)
  const [items] = await pool.query(
    "SELECT dv.*, p.nombre as producto_nombre FROM detalle_ventas dv LEFT JOIN productos p ON dv.producto_id = p.id WHERE dv.venta_id = ?", [id]);
  return { ...ventas[0], items };
};

export const SaleModel = {
  // Todas las ventas (las más recientes primero)
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT v.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre FROM ventas v LEFT JOIN clientes c ON v.cliente_id = c.id LEFT JOIN usuarios u ON v.usuario_id = u.id ORDER BY v.id DESC"
    );
    return rows;
  },

  findById: findByIdQuery,

  // Crea la venta en varios pasos DENTRO DE UNA TRANSACCIÓN
  // 1) inserta la venta  2) por cada producto verifica stock y lo descuenta
  // 3) registra el movimiento de inventario  4) calcula el total
  create: async ({ cliente_id, usuario_id, items }) => {
    const conn = await pool.getConnection(); // Pide una conexión dedicada
    try {
      await conn.beginTransaction(); // Empieza la transacción

      // Crea la venta (el total se calcula al final)
      const [venta] = await conn.query("INSERT INTO ventas (cliente_id, usuario_id) VALUES (?, ?)", [cliente_id || null, usuario_id]);
      const ventaId = venta.insertId;
      let total = 0;

      // Recorre cada producto vendido
      for (const item of items) {
        // "FOR UPDATE" bloquea el producto para que nadie más lo venda al mismo tiempo
        const [prod] = await conn.query("SELECT precio, stock FROM productos WHERE id = ? FOR UPDATE", [item.producto_id]);
        if (!prod[0]) throw new Error(`Producto ${item.producto_id} no existe`);
        if (prod[0].stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${item.producto_id}`);

        // Guarda el renglón del detalle con el precio de ese momento
        await conn.query(
          "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
          [ventaId, item.producto_id, item.cantidad, prod[0].precio]
        );

        // Descuenta del stock
        await conn.query("UPDATE productos SET stock = stock - ? WHERE id = ?", [item.cantidad, item.producto_id]);

        // Deja el movimiento de inventario registrado (tipo 'salida')
        await conn.query(
          "INSERT INTO movimientos_inventario (producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo) VALUES (?, ?, 'salida', ?, ?, ?, ?)",
          [item.producto_id, usuario_id, item.cantidad, prod[0].stock, prod[0].stock - item.cantidad, `Venta #${ventaId}`]
        );

        total += item.cantidad * prod[0].precio; // Va sumando el total
      }

      // Guarda el total calculado y cierra la transacción (todo quedó bien)
      await conn.query("UPDATE ventas SET total = ? WHERE id = ?", [total, ventaId]);
      await conn.commit();
      return findByIdQuery(ventaId); // Devuelve la venta completa con su detalle
    } catch (err) {
      await conn.rollback(); // Algo falló: se deshace TODO (no queda venta a medias)
      throw err;
    } finally {
      conn.release(); // Devuelve la conexión al grupo de conexiones
    }
  },

  // Borra una venta (su detalle se borra solo por el ON DELETE CASCADE)
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM ventas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};