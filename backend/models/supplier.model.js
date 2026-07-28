import pool from "../config/db.js";

export const SupplierModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM suppliers ORDER BY id");
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM suppliers WHERE id = ?", [id]);
    return rows[0] || null;
  },
  create: async (data) => {
    const [result] = await pool.query(
      "INSERT INTO suppliers (name, contact, phone, email, address, created_by) VALUES (?, ?, ?, ?, ?, ?)",
      [data.name, data.contact, data.phone, data.email, data.address, data.created_by || 1]
    );
    return { id: result.insertId, ...data };
  },
  update: async (id, fields) => {
    const sets = []; const values = [];
    ["name","contact","phone","email","address"].forEach(k => {
      if (fields[k] !== undefined) { sets.push(`${k} = ?`); values.push(fields[k]); }
    });
    if (sets.length === 0) return null;
    values.push(id);
    const [result] = await pool.query(`UPDATE suppliers SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM suppliers WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
