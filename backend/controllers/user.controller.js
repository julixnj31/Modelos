// ============================================================
// user.controller.js - Lógica de los usuarios del sistema
// ============================================================

import { UserModel } from "../models/user.model.js";

// Trae todos los usuarios (sin la contraseña, por seguridad)
const getAll = async (req, res) => {
  try { const data = await UserModel.findAll(); res.json({ success: true, message: "Lista de usuarios", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Busca un usuario por su id
const getById = async (req, res) => {
  try { const data = await UserModel.findById(Number(req.params.id)); if (!data) return res.status(404).json({ success: false, message: "Usuario no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Usuario encontrado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Registra un usuario nuevo; exige nombre, email y contraseña
const create = async (req, res) => {
  try { const { nombre, email, password, rol } = req.body; if (!nombre || !email || !password) return res.status(400).json({ success: false, message: "Nombre, email y password obligatorios", data: [], errors: [] }); const data = await UserModel.create({ nombre, email, password, rol }); res.status(201).json({ success: true, message: "Usuario creado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Edita datos de un usuario (nombre, email o rol)
const update = async (req, res) => {
  try { const data = await UserModel.update(Number(req.params.id), req.body); if (!data) return res.status(404).json({ success: false, message: "Usuario no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Usuario actualizado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Elimina un usuario del sistema
const remove = async (req, res) => {
  try { const ok = await UserModel.delete(Number(req.params.id)); if (!ok) return res.status(404).json({ success: false, message: "Usuario no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Usuario eliminado", data: [], errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAll, getById, create, update, remove };