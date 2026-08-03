// ============================================================
// category.model.js - Consultas SQL de categorías
// Es la "puerta" hacia la tabla categorias de la base de datos.
// ============================================================

import pool from "../config/db.js";

export const CategoryModel = {
  // Trae todas las categorías, en orden de creación
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categorias ORDER BY id");
    return rows;
  },

  // Busca una categoría por su id; si no existe devuelve null
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // Inserta una categoría nueva y devuelve el registro con su id
  create: async ({ nombre }) => {
    const [result] = await pool.query("INSERT INTO categorias (nombre) VALUES (?)", [nombre]);
    return { id: result.insertId, nombre };
  },

  // Renombra una categoría; si no había ninguna con ese id, devuelve null
  update: async (id, { nombre }) => {
    const [result] = await pool.query("UPDATE categorias SET nombre = ? WHERE id = ?", [nombre, id]);
    if (result.affectedRows === 0) return null;
    return { id, nombre };
  },

  // Borra una categoría y dice si de verdad se borró algo (true/false)
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};