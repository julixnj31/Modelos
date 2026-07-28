import pool from "../config/db.js";

export const CategoryModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categorias ORDER BY id");
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0] || null;
  },
  create: async ({ nombre }) => {
    const [result] = await pool.query("INSERT INTO categorias (nombre) VALUES (?)", [nombre]);
    return { id: result.insertId, nombre };
  },
  update: async (id, { nombre }) => {
    const [result] = await pool.query("UPDATE categorias SET nombre = ? WHERE id = ?", [nombre, id]);
    if (result.affectedRows === 0) return null;
    return { id, nombre };
  },
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
