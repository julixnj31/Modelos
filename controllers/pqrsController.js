const pqrsModel = require("../models/pqrsModel");

const obtenerTodos = async (req, res) => {
  try {
    const pqrs = await pqrsModel.obtenerTodos();

    res.status(200).json(pqrs);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los PQRS"
    });
  }
};


const obtenerPorId = async (req, res) => {
  try {
    const pqrs = await pqrsModel.obtenerPorId(req.params.id);

    if (!pqrs) {
      return res.status(404).json({
        message: "PQRS no encontrado"
      });
    }

    res.status(200).json(pqrs);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el PQRS"
    });
  }
};


const crear = async (req, res) => {
  try {

    const { nombre, email, asunto, descripcion } = req.body;


    if (!nombre || !email || !asunto || !descripcion) {
      return res.status(400).json({
        message: "Datos obligatorios faltantes"
      });
    }


    const nuevoPQRS = await pqrsModel.crear(req.body);

    res.status(201).json(nuevoPQRS);


  } catch (error) {

    res.status(500).json({
      message: "Error al crear PQRS"
    });

  }
};


const actualizar = async (req, res) => {

  try {

    const actualizado = await pqrsModel.actualizar(
      req.params.id,
      req.body
    );


    if (!actualizado) {
      return res.status(404).json({
        message: "PQRS no encontrado"
      });
    }


    res.status(200).json(actualizado);


  } catch (error) {

    res.status(500).json({
      message: "Error al actualizar PQRS"
    });

  }

};


const eliminar = async (req, res) => {

  try {

    const eliminado = await pqrsModel.eliminar(req.params.id);


    if (!eliminado) {
      return res.status(404).json({
        message: "PQRS no encontrado"
      });
    }


    res.status(200).json({
      message: "PQRS eliminado correctamente",
      data: eliminado
    });


  } catch (error) {

    res.status(500).json({
      message: "Error al eliminar PQRS"
    });

  }

};


module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};