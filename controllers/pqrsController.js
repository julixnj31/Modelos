const pqrsModel = require("../models/pqrsModel");

const obtenerTodas = async (req, res) => {
  try {
    const pqrs = await pqrsModel.obtenerTodas();
    res.status(200).json(pqrs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las PQRS" });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const pqrs = await pqrsModel.obtenerPorId(req.params.id);

    if (!pqrs) {
      return res.status(404).json({ message: "PQRS no encontrada" });
    }

    res.status(200).json(pqrs);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la PQRS" });
  }
};

const crear = async (req, res) => {
  try {
    const nuevaPqrs = await pqrsModel.crear(req.body);
    res.status(201).json(nuevaPqrs);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la PQRS" });
  }
};

const actualizar = async (req, res) => {
  try {
    const pqrsActualizada = await pqrsModel.actualizar(req.params.id, req.body);

    if (!pqrsActualizada) {
      return res.status(404).json({ message: "PQRS no encontrada" });
    }

    res.status(200).json(pqrsActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la PQRS" });
  }
};

const eliminar = async (req, res) => {
  try {
    const pqrsEliminada = await pqrsModel.eliminar(req.params.id);

    if (!pqrsEliminada) {
      return res.status(404).json({ message: "PQRS no encontrada" });
    }

    res.status(200).json({
      message: "PQRS eliminada correctamente",
      data: pqrsEliminada
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la PQRS" });
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
