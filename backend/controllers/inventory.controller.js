import { InventoryModel } from "../models/inventory.model.js";

const getAll = async (req, res) => {
  try { const data = await InventoryModel.findAll(); res.json({ success: true, message: "Movimientos de inventario", data, errors: [] }); }
  catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};
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
