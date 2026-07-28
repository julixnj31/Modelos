import { InventoryModel } from "../models/inventory.model.js";

const getAll = async (req, res) => {
  try { const data = await InventoryModel.findAll(); res.json({ success: true, message: "Movimientos de inventario", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
const create = async (req, res) => {
  try { const { productId, userId, type, quantity, reason } = req.body; if (!productId || !userId || !type || quantity === undefined) return res.status(400).json({ success: false, message: "productId, userId, type y quantity obligatorios", data: [], errors: [] }); const data = await InventoryModel.create({ productId, userId, type, quantity, reason }); res.status(201).json({ success: true, message: "Movimiento registrado", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAll, create };
