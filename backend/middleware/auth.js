// ============================================================
// auth.js (middleware) - Sesiones y protección de rutas
// Aquí vive el "token": cuando alguien inicia sesión se le entrega
// una llave única. Las rutas protegidas piden esa llave; si no la
// tienen (o no es válida) responden 401 y no dejan pasar.
// ============================================================

import crypto from "node:crypto";

// Almacén de sesiones activas: token -> id del usuario
// (en memoria: al reiniciar el servidor hay que volver a iniciar sesión)
const sessions = new Map();

// Entrega un token nuevo a un usuario (llave de acceso)
export const createToken = (userId) => {
  const token = crypto.randomUUID();
  sessions.set(token, userId);
  return token;
};

// Verifica si un token existe y a qué usuario pertenece (null si no sirve)
export const verifyToken = (token) => sessions.get(token) || null;

// Guardia de autenticación: se coloca delante de las rutas protegidas.
// Lee el token del encabezado "Authorization: Bearer <token>".
export const authGuard = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const userId = token ? verifyToken(token) : null;
  if (!userId) {
    return res.status(401).json({ success: false, message: "No autorizado: inicia sesión", data: [], errors: [] });
  }
  req.userId = userId; // Deja el id del usuario a disposición de las rutas
  next();
};