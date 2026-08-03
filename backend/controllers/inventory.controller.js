// ============================================================
// inventory.controller.js - Lógica de los movimientos de inventario
// Aquí se registran entradas, salidas y ajustes de stock.
// ============================================================

import { InventoryModel } from "../models/inventory.model.js";

// Trae todo el historial de movimientos de inventario
const getAll = async (req, res) => {
  try { const data = await InventoryModel.findAll(); res.json({ success: true, message: "Movimientos de inventario", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Registra un movimiento. Obligatorio: producto, usuario, tipo y cantidad.
// Ejemplos: entrada (llega mercancía), salida (se vende/sale algo), ajuste (corregir conteo).
const create = async (req, res) => {
  try {
    const { producto_id, usuario_id, tipo, cantidad, motivo } = req.body;
    if (!producto_id || !usuario_id || !tipo || cantidad === undefined)
      return res.status(400).json({ success: false, message: "producto_id, usuario_id, tipo y cantidad obligatorios", data: [], errors: [] });
    const data = await InventoryModel.create({ producto_id, usuario_id, tipo, cantidad, motivo });
    res.status(201).json({ success: true, message: "Movimiento registrado", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAll, create };