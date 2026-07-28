import pool from "../config/db.js";

export const ProductModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0] || null;
  },

  findByCategoryId: async (categoryId) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE categoryId = ?", [categoryId]);
    return rows;
  },

  create: async ({ name, price, categoryId }) => {
    const [result] = await pool.query(
      "INSERT INTO products (name, price, categoryId) VALUES (?, ?, ?)",
      [name, price, categoryId]
    );
    return { id: result.insertId, name, price, categoryId };
  },

  update: async (id, fields) => {
    const sets = [];
    const values = [];
    if (fields.name !== undefined) { sets.push("name = ?"); values.push(fields.name); }
    if (fields.price !== undefined) { sets.push("price = ?"); values.push(fields.price); }
    if (fields.categoryId !== undefined) { sets.push("categoryId = ?"); values.push(fields.categoryId); }
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
