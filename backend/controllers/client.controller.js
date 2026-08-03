// ============================================================
// client.controller.js - Lógica de los clientes
// ============================================================

import { ClientModel } from "../models/client.model.js";

// Trae todos los clientes
const getAll = async (req, res) => {
  try { const data = await ClientModel.findAll(); res.json({ success: true, message: "Lista de clientes", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Busca un cliente por su id
const getById = async (req, res) => {
  try { const data = await ClientModel.findById(Number(req.params.id)); if (!data) return res.status(404).json({ success: false, message: "Cliente no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Cliente encontrado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Registra un cliente nuevo; el nombre es obligatorio
const create = async (req, res) => {
  try { const { nombre } = req.body; if (!nombre) return res.status(400).json({ success: false, message: "Nombre obligatorio", data: [], errors: [] }); const data = await ClientModel.create(req.body); res.status(201).json({ success: true, message: "Cliente creado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Edita los datos del cliente (solo lo que se envíe)
const update = async (req, res) => {
  try { const data = await ClientModel.update(Number(req.params.id), req.body); if (!data) return res.status(404).json({ success: false, message: "Cliente no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Cliente actualizado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Elimina un cliente
const remove = async (req, res) => {
  try { const ok = await ClientModel.delete(Number(req.params.id)); if (!ok) return res.status(404).json({ success: false, message: "Cliente no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Cliente eliminado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAll, getById, create, update, remove };