const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");

// Nunca se debe devolver el password al cliente.
const sinPassword = (user) => {
  const { password, ...resto } = user;
  return resto;
};

const obtenerTodos = async (req, res) => {
  try {
    const users = await userModel.obtenerTodas();
    res.status(200).json(users.map(sinPassword));
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const user = await userModel.obtenerPorId(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(sinPassword(user));
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

const crear = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email y password son obligatorios" });
    }

    const existente = await userModel.obtenerPorEmail(email);

    if (existente) {
      return res.status(409).json({ message: "Ya existe un usuario con ese email" });
    }

    const nuevoUsuario = await userModel.crear(req.body);
    res.status(201).json(sinPassword(nuevoUsuario));
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

const actualizar = async (req, res) => {
  try {
    const usuarioActualizado = await userModel.actualizar(req.params.id, req.body);

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(sinPassword(usuarioActualizado));
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

const actualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "El status debe ser 'active' o 'inactive'" });
    }

    const usuarioActualizado = await userModel.actualizarStatus(req.params.id, status);

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(sinPassword(usuarioActualizado));
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el status del usuario" });
  }
};

const eliminar = async (req, res) => {
  try {
    const usuarioEliminado = await userModel.eliminar(req.params.id);

    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      data: sinPassword(usuarioEliminado)
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

const obtenerTareasDeUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    const esElMismoUsuario = req.user.id === Number(userId);
    const esAdmin = req.user.role === "admin";

    if (!esElMismoUsuario && !esAdmin) {
      return res.status(403).json({ message: "No tienes permisos para ver estas tareas" });
    }

    const usuario = await userModel.obtenerPorId(userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const tareas = await taskModel.obtenerPorUsuario(userId);
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas del usuario" });
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  actualizarStatus,
  eliminar,
  obtenerTareasDeUsuario
};
