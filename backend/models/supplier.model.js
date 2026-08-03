// ============================================================
// supplier.model.js - Consultas SQL de proveedores
// ============================================================

import pool from "../config/db.js";

export const SupplierModel = {
  // Todos los proveedores, en orden de creación
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM proveedores ORDER BY id");
    return rows;
  },

  // Busca un proveedor por id
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM proveedores WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // Guarda un proveedor nuevo (todos sus datos van según lo que llegue)
  create: async (data) => {
    const [result] = await pool.query(
      "INSERT INTO proveedores (nombre, contacto, telefono, email, direccion, creado_por) VALUES (?, ?, ?, ?, ?, ?)",
      [data.nombre, data.contacto, data.telefono, data.email, data.direccion, data.creado_por || 1]
    );
    return { id: result.insertId, ...data };
  },

  // Edita solo los campos que lleguen (nombre, contacto, teléfono, etc.)
  update: async (id, fields) => {
    const sets = []; const values = [];
    ["nombre","contacto","telefono","email","direccion"].forEach(k => {
      if (fields[k] !== undefined) { sets.push(`${k} = ?`); values.push(fields[k]); }
    });
    if (sets.length === 0) return null;
    values.push(id);
    const [result] = await pool.query(`UPDATE proveedores SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },

  // Elimina un proveedor
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM proveedores WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};