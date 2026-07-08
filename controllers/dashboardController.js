const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticasTareas = await taskModel.obtenerEstadisticas();
    const usuarios = await userModel.obtenerTodas();

    res.status(200).json({
      totalUsuarios: usuarios.length,
      usuariosActivos: usuarios.filter((user) => user.status === "active").length,
      ...estadisticasTareas
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las estadisticas del dashboard" });
  }
};

module.exports = {
  obtenerEstadisticas
};
