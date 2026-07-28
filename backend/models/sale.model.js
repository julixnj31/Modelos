import pool from "../config/db.js";

const findByIdQuery = async (id) => {
  const [sales] = await pool.query(
    "SELECT s.*, c.name as clientName, u.name as userName FROM sales s LEFT JOIN clients c ON s.clientId = c.id LEFT JOIN users u ON s.userId = u.id WHERE s.id = ?", [id]);
  if (sales.length === 0) return null;
  const [items] = await pool.query(
    "SELECT si.*, p.name as productName FROM sale_items si LEFT JOIN products p ON si.productId = p.id WHERE si.saleId = ?", [id]);
  return { ...sales[0], items };
};

export const SaleModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT s.*, c.name as clientName, u.name as userName FROM sales s LEFT JOIN clients c ON s.clientId = c.id LEFT JOIN users u ON s.userId = u.id ORDER BY s.id DESC"
    );
    return rows;
  },

  findById: findByIdQuery,

  create: async ({ clientId, userId, items }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [sale] = await conn.query("INSERT INTO sales (clientId, userId) VALUES (?, ?)", [clientId || null, userId]);
      const saleId = sale.insertId;
      let total = 0;
      for (const item of items) {
        const [prod] = await conn.query("SELECT price, stock FROM products WHERE id = ? FOR UPDATE", [item.productId]);
        if (!prod[0]) throw new Error(`Producto ${item.productId} no existe`);
        if (prod[0].stock < item.quantity) throw new Error(`Stock insuficiente para producto ${item.productId}`);
        await conn.query(
          "INSERT INTO sale_items (saleId, productId, quantity, unit_price) VALUES (?, ?, ?, ?)",
          [saleId, item.productId, item.quantity, prod[0].price]
        );
        await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.productId]);
        await conn.query(
          "INSERT INTO inventory_movements (productId, userId, type, quantity, previous_stock, new_stock, reason) VALUES (?, ?, 'salida', ?, ?, ?, ?)",
          [item.productId, userId, item.quantity, prod[0].stock, prod[0].stock - item.quantity, `Venta #${saleId}`]
        );
        total += item.quantity * prod[0].price;
      }
      await conn.query("UPDATE sales SET total = ? WHERE id = ?", [total, saleId]);
      await conn.commit();
      return findByIdQuery(saleId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM sales WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
