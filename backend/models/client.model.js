// ============================================================
// client.model.js - Consultas SQL de clientes
// ============================================================

import pool from "../config/db.js";

export const ClientModel = {
  // Todos los clientes, en orden de creación
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM clientes ORDER BY id");
    return rows;
  },

  // Busca un cliente por id
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM clientes WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // Guarda un cliente nuevo con los datos que lleguen
  create: async (data) => {
    const [result] = await pool.query(
      "INSERT INTO clientes (nombre, documento, telefono, email, direccion, creado_por) VALUES (?, ?, ?, ?, ?, ?)",
      [data.nombre, data.documento, data.telefono, data.email, data.direccion, data.creado_por || 1]
    );
    return { id: result.insertId, ...data };
  },

  // Edita solo los campos que se envíen
  async update(id, fields) {
    const sets = []; const values = [];
    ["nombre","documento","telefono","email","direccion"].forEach(k => {
      if (fields[k] !== undefined) { sets.push(`${k} = ?`); values.push(fields[k]); }
    });
    if (sets.length === 0) return null;
    values.push(id);
    const [result] = await pool.query(`UPDATE clientes SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  // Elimina un cliente
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM clientes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};