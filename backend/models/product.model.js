// ============================================================
// product.model.js - Consultas SQL de productos
// ============================================================

import pool from "../config/db.js";

export const ProductModel = {
  // Trae todos los productos y además el nombre de su categoría y proveedor
  // (por eso los LEFT JOIN: se mezclan las tablas relacionadas)
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT p.*, c.nombre as categoria_nombre, pv.nombre as proveedor_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LEFT JOIN proveedores pv ON p.proveedor_id = pv.id ORDER BY p.id"
    );
    return rows;
  },

  // Busca un producto por id (con su categoría y proveedor)
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT p.*, c.nombre as categoria_nombre, pv.nombre as proveedor_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LEFT JOIN proveedores pv ON p.proveedor_id = pv.id WHERE p.id = ?", [id]);
    return rows[0] || null;
  },

  // Trae todos los productos que pertenecen a una categoría
  // (se usa en la ruta /categorias/:id/products y al borrar una categoría)
  findByCategoryId: async (categoria_id) => {
    const [rows] = await pool.query("SELECT * FROM productos WHERE categoria_id = ?", [categoria_id]);
    return rows;
  },

  // Inserta un producto nuevo. Si no mandan stock o mínimo, usa un valor por defecto.
  create: async ({ nombre, precio, categoria_id, stock, stock_minimo, proveedor_id, creado_por }) => {
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, precio, categoria_id, stock, stock_minimo, proveedor_id, creado_por) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, precio, categoria_id, stock || 0, stock_minimo || 5, proveedor_id, creado_por || 1]
    );
    return { id: result.insertId, nombre, precio, categoria_id };
  },

  // Actualiza SOLO los campos que lleguen (si el cuerpo no trae "precio",
  // el precio no se toca). Esto arma el UPDATE en el momento.
  async update(id, fields) {
    const sets = []; const values = [];
    ["nombre","precio","categoria_id","stock","stock_minimo","proveedor_id"].forEach(k => {
      if (fields[k] !== undefined) { sets.push(`${k} = ?`); values.push(fields[k]); }
    });
    if (sets.length === 0) return null; // Si no llegó nada, no hay nada que editar
    values.push(id);
    const [result] = await pool.query(`UPDATE productos SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null; // No existía el producto
    return this.findById(id); // Devuelve el producto ya actualizado
  },

  // Borra un producto y avisa (true/false) si existía
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};