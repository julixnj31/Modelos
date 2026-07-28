import pool from "../config/db.js";

export const UserModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY id");
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  },
  create: async ({ name, email, password, role }) => {
    const [result] = await pool.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, password, role || 'vendedor']);
    return { id: result.insertId, name, email, role: role || 'vendedor' };
  },
  update: async (id, fields) => {
    const sets = []; const values = [];
    if (fields.name) { sets.push("name = ?"); values.push(fields.name); }
    if (fields.email) { sets.push("email = ?"); values.push(fields.email); }
    if (fields.role) { sets.push("role = ?"); values.push(fields.role); }
    if (sets.length === 0) return null;
    values.push(id);
    const [result] = await pool.query(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  },
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
