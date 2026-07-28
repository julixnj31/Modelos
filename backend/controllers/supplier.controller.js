import { SupplierModel } from "../models/supplier.model.js";

const getAll = async (req, res) => {
  try { const data = await SupplierModel.findAll(); res.json({ success: true, message: "Lista de proveedores", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
const getById = async (req, res) => {
  try { const data = await SupplierModel.findById(Number(req.params.id)); if (!data) return res.status(404).json({ success: false, message: "Proveedor no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Proveedor encontrado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
const create = async (req, res) => {
  try { const { nombre } = req.body; if (!nombre) return res.status(400).json({ success: false, message: "Nombre obligatorio", data: [], errors: [] }); const data = await SupplierModel.create(req.body); res.status(201).json({ success: true, message: "Proveedor creado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
const update = async (req, res) => {
  try { const data = await SupplierModel.update(Number(req.params.id), req.body); if (!data) return res.status(404).json({ success: false, message: "Proveedor no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Proveedor actualizado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
const remove = async (req, res) => {
  try { const ok = await SupplierModel.delete(Number(req.params.id)); if (!ok) return res.status(404).json({ success: false, message: "Proveedor no encontrado", data: [], errors: [] }); res.json({ success: true, message: "Proveedor eliminado", data: [], errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAll, getById, create, update, remove };
