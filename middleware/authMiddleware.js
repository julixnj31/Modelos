const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_tasks_app";

// Verifica el token JWT enviado en el header Authorization: Bearer <token>.
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido o expirado" });
  }
};

// Solo permite continuar si req.user.role esta dentro de los roles permitidos.
const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta accion" });
    }
    next();
  };
};

module.exports = {
  JWT_SECRET,
  verifyToken,
  requireRole
};
