// ============================================================
// db.js - Conexión con la base de datos MySQL
// Todas las consultas del sistema pasan por este archivo.
// ============================================================

import mysql from "mysql2/promise";
import dotenv from "dotenv/config"; // Carga las credenciales del archivo .env

// "pool" = grupo de conexiones reutilizables (más rápido que abrir una por consulta)
const pool = mysql.createPool({
  // Datos de acceso a la BD, salen del .env (cada quien usa las suyas)
  host: process.env.DB_HOST || "localhost", // Dónde está MySQL
  user: process.env.DB_USER || "root", // Usuario de la BD
  password: process.env.DB_PASSWORD, // Contraseña (solo desde .env, no va en el código)
  database: process.env.DB_NAME || "inventario_adso", // Nombre de la base de datos
  port: process.env.DB_PORT || 3306, // Puerto de MySQL (3306 es el estándar)
  waitForConnections: true, // Si no hay conexión libre, espera en fila
  connectionLimit: 10, // Máximo de conexiones abiertas a la vez
  queueLimit: 0, // Sin límite de espera en la fila
});

export default pool;
