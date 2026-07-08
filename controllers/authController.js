const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const { JWT_SECRET } = require("../middleware/authMiddleware");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y password son obligatorios" });
    }

    const user = await userModel.obtenerPorEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciales invalidas" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "El usuario esta inactivo" });
    }

    const passwordValida = bcrypt.compareSync(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales invalidas" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "8h"
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesion" });
  }
};

module.exports = {
  login
};
