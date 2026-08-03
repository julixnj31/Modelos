// ============================================================
// auth.controller.js - Lógica del inicio de sesión
// Recibe email + contraseña, los compara con la base de datos
// y si son correctos entrega un token de acceso.
// ============================================================

import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { createToken } from "../middleware/auth.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Los dos campos son obligatorios
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email y contraseña obligatorios", data: [], errors: [] });
    }

    // Busca al usuario por email (aquí sí se trae la contraseña encriptada)
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas", data: [], errors: [] });
    }

    // Compara la contraseña escrita con la encriptada de la base de datos
    const correcta = await bcrypt.compare(password, user.password);
    if (!correcta) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas", data: [], errors: [] });
    }

    // Todo bien: se entrega el token y los datos del usuario (sin contraseña)
    const token = createToken(user.id);
    res.json({
      success: true,
      message: "Inicio de sesión correcto",
      data: {
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      },
      errors: [],
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] });
  }
};

export { login };