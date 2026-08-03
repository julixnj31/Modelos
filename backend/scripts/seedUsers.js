// ============================================================
// seedUsers.js - Actualiza los usuarios de prueba con contraseña encriptada
// Si tu base ya la creaste con el database.sql viejo (contraseñas en texto
// plano), corre esto para dejarlas en bcrypt:
//     npm run seed
// ============================================================

import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const users = [
  { nombre: "Admin", email: "admin@inventario.com", password: "admin123", rol: "admin" },
  { nombre: "Vendedor", email: "vendedor@inventario.com", password: "vendedor123", rol: "vendedor" },
  { nombre: "Bodeguero", email: "bodega@inventario.com", password: "bodega123", rol: "bodeguero" },
];

const run = async () => {
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?) " +
      "ON DUPLICATE KEY UPDATE password = ?",
      [u.nombre, u.email, passwordHash, u.rol, passwordHash]
    );
    console.log(`Usuario listo: ${u.email}`);
  }
  process.exit(0);
};

run().catch(e => { console.error("ERROR:", e.message); process.exit(1); });