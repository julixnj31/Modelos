// ============================================================
// product.controller.js - La lógica de los productos
// Recibe lo que el cliente pide y le devuelve una respuesta.
// ============================================================

import { ProductModel } from "../models/product.model.js";

// Trae todos los productos de la base de datos
const getAllProducts = async (req, res) => {
  try {
    const data = await ProductModel.findAll();
    res.status(200).json({ success: true, message: "Lista de productos", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Busca un solo producto por su id. Si no existe, responde 404.
const getProductById = async (req, res) => {
  try {
    const data = await ProductModel.findById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: "Producto no encontrado", data: [], errors: [] });
    res.status(200).json({ success: true, message: "Producto encontrado", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Crea un producto. Exige nombre y precio; si faltan responde 400 (petición mala).
const createProduct = async (req, res) => {
  try {
    const { nombre, precio, categoria_id } = req.body;
    if (!nombre || !precio) return res.status(400).json({ success: false, message: "Nombre y precio obligatorios", data: [], errors: [] });
    const data = await ProductModel.create({ nombre, precio, categoria_id, ...req.body });
    res.status(201).json({ success: true, message: "Producto creado", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Actualiza un producto (solo los campos que lleguen en la petición).
const updateProduct = async (req, res) => {
  try {
    const data = await ProductModel.update(Number(req.params.id), req.body);
    if (!data) return res.status(404).json({ success: false, message: "Producto no encontrado", data: [], errors: [] });
    res.status(200).json({ success: true, message: "Producto actualizado", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

// Borra un producto. Si no se borró nada, es que no existía.
const deleteProduct = async (req, res) => {
  try {
    const ok = await ProductModel.delete(Number(req.params.id));
    if (!ok) return res.status(404).json({ success: false, message: "Producto no encontrado", data: [], errors: [] });
    res.status(200).json({ success: true, message: "Producto eliminado", data: [], errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };