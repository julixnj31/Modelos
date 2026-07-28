import pool from "../config/db.js";

export const ProductModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT p.*, c.name as categoryName, s.name as supplierName FROM products p LEFT JOIN categories c ON p.categoryId = c.id LEFT JOIN suppliers s ON p.supplierId = s.id ORDER BY p.id"
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT p.*, c.name as categoryName, s.name as supplierName FROM products p LEFT JOIN categories c ON p.categoryId = c.id LEFT JOIN suppliers s ON p.supplierId = s.id WHERE p.id = ?", [id]);
    return rows[0] || null;
  },

  findByCategoryId: async (categoryId) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE categoryId = ?", [categoryId]);
    return rows;
  },

  create: async ({ name, price, categoryId, stock, min_stock, supplierId, created_by }) => {
    const [result] = await pool.query(
      "INSERT INTO products (name, price, categoryId, stock, min_stock, supplierId, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, price, categoryId, stock || 0, min_stock || 5, supplierId, created_by || 1]
    );
    return { id: result.insertId, name, price, categoryId, stock: stock || 0 };
  },

  update: async (id, fields) => {
    const sets = []; const values = [];
    ["name","price","categoryId","stock","min_stock","supplierId"].forEach(k => {
      if (fields[k] !== undefined) { sets.push(`${k} = ?`); values.push(fields[k]); }
    });
    if (sets.length === 0) return null;
    values.push(id);
    const [result] = await pool.query(`UPDATE products SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
