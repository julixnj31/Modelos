// ============================================================
// sale.controller.js - Lógica de las ventas
// ============================================================

import { SaleModel } from "../models/sale.model.js";

// Trae todas las ventas registradas
const getAll = async (req, res) => {
  try { const data = await SaleModel.findAll(); res.json({ success: true, message: "Lista de ventas", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Busca una venta por su id (incluye los productos vendidos)
const getById = async (req, res) => {
  try { const data = await SaleModel.findById(Number(req.params.id)); if (!data) return res.status(404).json({ success: false, message: "Venta no encontrada", data: [], errors: [] }); res.json({ success: true, message: "Venta encontrada", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Crea una venta. Necesita el vendedor (usuario_id) y la lista de items
// Con los items se descuenta stock y se calcula el total.
const create = async (req, res) => {
  try {
    const { cliente_id, usuario_id, items } = req.body;
    if (!usuario_id || !items || !items.length)
      return res.status(400).json({ success: false, message: "usuario_id y items obligatorios", data: [], errors: [] });
    const data = await SaleModel.create({ cliente_id, usuario_id, items });
    res.status(201).json({ success: true, message: "Venta creada", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error al crear venta", data: [], errors: [e.message] }); }
};

// Elimina una venta
const remove = async (req, res) => {
  try { const ok = await SaleModel.delete(Number(req.params.id)); if (!ok) return res.status(404).json({ success: false, message: "Venta no encontrada", data: [], errors: [] }); res.json({ success: true, message: "Venta eliminada", data: [], errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAll, getById, create, remove };