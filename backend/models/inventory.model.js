import pool from "../config/db.js";

export const InventoryModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT im.*, p.name as productName, u.name as userName FROM inventory_movements im LEFT JOIN products p ON im.productId = p.id LEFT JOIN users u ON im.userId = u.id ORDER BY im.id DESC"
    );
    return rows;
  },

  create: async ({ productId, userId, type, quantity, reason }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [prod] = await conn.query("SELECT stock FROM products WHERE id = ? FOR UPDATE", [productId]);
      if (!prod[0]) throw new Error("Producto no existe");
      const previous_stock = prod[0].stock;
      let new_stock = previous_stock;
      if (type === 'entrada') new_stock = previous_stock + quantity;
      else if (type === 'salida') new_stock = previous_stock - quantity;
      else if (type === 'ajuste') new_stock = quantity;
      if (new_stock < 0) throw new Error("Stock no puede ser negativo");
      await conn.query(
        "INSERT INTO inventory_movements (productId, userId, type, quantity, previous_stock, new_stock, reason) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [productId, userId, type, quantity, previous_stock, new_stock, reason]
      );
      await conn.query("UPDATE products SET stock = ? WHERE id = ?", [new_stock, productId]);
      await conn.commit();
      return { productId, userId, type, quantity, previous_stock, new_stock, reason };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
