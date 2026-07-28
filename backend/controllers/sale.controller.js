import { SaleModel } from "../models/sale.model.js";

const getAll = async (req, res) => {
  try { const data = await SaleModel.findAll(); res.json({ success: true, message: "Lista de ventas", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
const getById = async (req, res) => {
  try { const data = await SaleModel.findById(Number(req.params.id)); if (!data) return res.status(404).json({ success: false, message: "Venta no encontrada", data: [], errors: [] }); res.json({ success: true, message: "Venta encontrada", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
const create = async (req, res) => {
  try { const { clientId, userId, items } = req.body; if (!userId || !items || !items.length) return res.status(400).json({ success: false, message: "userId y items obligatorios", data: [], errors: [] }); const data = await SaleModel.create({ clientId, userId, items }); res.status(201).json({ success: true, message: "Venta creada", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error al crear venta", data: [], errors: [e.message] }); }
};
const remove = async (req, res) => {
  try { const ok = await SaleModel.delete(Number(req.params.id)); if (!ok) return res.status(404).json({ success: false, message: "Venta no encontrada", data: [], errors: [] }); res.json({ success: true, message: "Venta eliminada", data: [], errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAll, getById, create, remove };
