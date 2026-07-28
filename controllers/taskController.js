const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

const obtenerTodas = async (req, res) => {
  try {
    const tasks = await taskModel.obtenerTodas();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas" });
  }
};

const filtrar = async (req, res) => {
  try {
    const { status, priority, userId, desde, hasta } = req.query;
    const tareas = await taskModel.filtrar({ status, priority, userId, desde, hasta });
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar las tareas" });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const task = await taskModel.obtenerPorId(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const esAdmin = req.user.role === "admin";
    const estaAsignado = task.assignedUsers.includes(req.user.id);

    if (!esAdmin && !estaAsignado) {
      return res.status(403).json({ message: "No tienes permisos para ver esta tarea" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la tarea" });
  }
};

const crear = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title y description son obligatorios" });
    }

    const nuevaTarea = await taskModel.crear(req.body);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la tarea" });
  }
};

const actualizar = async (req, res) => {
  try {
    const tareaActualizada = await taskModel.actualizar(req.params.id, req.body);

    if (!tareaActualizada) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};

const actualizarEstado = async (req, res) => {
  try {
    const { status } = req.body;
    const estadosValidos = ["pendiente", "en_progreso", "completada"];

    if (!estadosValidos.includes(status)) {
      return res.status(400).json({
        message: `El status debe ser uno de: ${estadosValidos.join(", ")}`
      });
    }

    const task = await taskModel.obtenerPorId(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const esAdmin = req.user.role === "admin";
    const estaAsignado = task.assignedUsers.includes(req.user.id);

    if (!esAdmin && !estaAsignado) {
      return res.status(403).json({ message: "No tienes permisos para actualizar esta tarea" });
    }

    const tareaActualizada = await taskModel.actualizarEstado(req.params.id, status);
    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado de la tarea" });
  }
};

const eliminar = async (req, res) => {
  try {
    const tareaEliminada = await taskModel.eliminar(req.params.id);

    if (!tareaEliminada) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({
      message: "Tarea eliminada correctamente",
      data: tareaEliminada
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tarea" });
  }
};

const asignar = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "userIds debe ser un arreglo con al menos un id" });
    }

    const tareaActualizada = await taskModel.asignarUsuarios(req.params.taskId, userIds);

    if (!tareaActualizada) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al asignar usuarios a la tarea" });
  }
};

const obtenerUsuariosAsignados = async (req, res) => {
  try {
    const idsAsignados = await taskModel.obtenerIdsUsuariosAsignados(req.params.taskId);

    if (idsAsignados === null) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const usuarios = await userModel.obtenerTodas();

    const asignados = usuarios
      .filter((user) => idsAsignados.includes(user.id))
      .map(({ password: _, ...resto }) => resto);

    res.status(200).json(asignados);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios asignados" });
  }
};

const quitarUsuario = async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const tareaActualizada = await taskModel.quitarUsuario(taskId, userId);

    if (!tareaActualizada) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al quitar el usuario de la tarea" });
  }
};

module.exports = {
  obtenerTodas,
  filtrar,
  obtenerPorId,
  crear,
  actualizar,
  actualizarEstado,
  eliminar,
  asignar,
  obtenerUsuariosAsignados,
  quitarUsuario
};
