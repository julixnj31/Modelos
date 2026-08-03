// ============================================================
// user.model.js - Consultas SQL de usuarios
// ============================================================

import pool from "../config/db.js";

export const UserModel = {
  // Trae todos los usuarios, pero SIN la contraseña
  // (por seguridad: la password nunca debe viajar al cliente)
  findAll: async () => {
    const [rows] = await pool.query("SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id");
    return rows;
  },

  // Busca un usuario por id, también sin contraseña
  findById: async (id) => {
    const [rows] = await pool.query("SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // Registra un usuario. Si no dicen el rol, queda como 'vendedor' por defecto.
  create: async ({ nombre, email, password, rol }) => {
    const [result] = await pool.query("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)", [nombre, email, password, rol || 'vendedor']);
    return { id: result.insertId, nombre, email, rol: rol || 'vendedor' };
  },

  // Edita nombre, email y/o rol (solo lo que venga en la petición)
  update: async (id, fields) => {
    const sets = []; const values = [];
    if (fields.nombre) { sets.push("nombre = ?"); values.push(fields.nombre); }
    if (fields.email) { sets.push("email = ?"); values.push(fields.email); }
    if (fields.rol) { sets.push("rol = ?"); values.push(fields.rol); }
    if (sets.length === 0) return null; // No llegó nada para editar
    values.push(id);
    const [result] = await pool.query(`UPDATE usuarios SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id); // Devuelve el usuario ya editado
  },

  // Elimina un usuario del sistema
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};