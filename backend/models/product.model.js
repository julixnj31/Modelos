import pool from "../config/db.js";

export const ProductModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT p.*, c.nombre as categoria_nombre, pv.nombre as proveedor_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LEFT JOIN proveedores pv ON p.proveedor_id = pv.id ORDER BY p.id"
    );
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT p.*, c.nombre as categoria_nombre, pv.nombre as proveedor_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id LEFT JOIN proveedores pv ON p.proveedor_id = pv.id WHERE p.id = ?", [id]);
    return rows[0] || null;
  },
  findByCategoryId: async (categoria_id) => {
    const [rows] = await pool.query("SELECT * FROM productos WHERE categoria_id = ?", [categoria_id]);
    return rows;
  },
  create: async ({ nombre, precio, categoria_id, stock, stock_minimo, proveedor_id, creado_por }) => {
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, precio, categoria_id, stock, stock_minimo, proveedor_id, creado_por) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, precio, categoria_id, stock || 0, stock_minimo || 5, proveedor_id, creado_por || 1]
    );
    return { id: result.insertId, nombre, precio, categoria_id };
  },
  update: async (id, fields) => {
    const sets = []; const values = [];
    ["nombre","precio","categoria_id","stock","stock_minimo","proveedor_id"].forEach(k => {
      if (fields[k] !== undefined) { sets.push(`${k} = ?`); values.push(fields[k]); }
    });
    if (sets.length === 0) return null;
    values.push(id);
    const [result] = await pool.query(`UPDATE productos SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
