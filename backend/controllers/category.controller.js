import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

const getAllCategories = async (req, res) => {
  try {
    const data = await CategoryModel.findAll();
    res.status(200).json({ success: true, message: "Lista de categorías", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

const getCategoryById = async (req, res) => {
  try {
    const data = await CategoryModel.findById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: "Categoría no encontrada", data: [], errors: [] });
    res.status(200).json({ success: true, message: "Categoría encontrada", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

const createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ success: false, message: "El nombre es obligatorio", data: [], errors: [] });
    const data = await CategoryModel.create({ nombre });
    res.status(201).json({ success: true, message: "Categoría creada", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

const updateCategory = async (req, res) => {
  try {
    const data = await CategoryModel.update(Number(req.params.id), req.body);
    if (!data) return res.status(404).json({ success: false, message: "Categoría no encontrada", data: [], errors: [] });
    res.status(200).json({ success: true, message: "Categoría actualizada", data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exists = await CategoryModel.findById(id);
    if (!exists) return res.status(404).json({ success: false, message: "Categoría no encontrada", data: [], errors: [] });
    const linked = await ProductModel.findByCategoryId(id);
    if (linked && linked.length > 0) return res.status(409).json({ success: false, message: "No se puede eliminar la categoría porque tiene productos vinculados", data: [], errors: [] });
    await CategoryModel.delete(id);
    res.status(200).json({ success: true, message: "Categoría eliminada", data: [], errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

const getProductsByCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cat = await CategoryModel.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: "Categoría no existe", data: [], errors: [] });
    const data = await ProductModel.findByCategoryId(id);
    res.status(200).json({ success: true, message: `Productos de: ${cat.nombre}`, data, errors: [] });
  } catch (e) { res.status(500).json({ success: false, message: "Error", data: [], errors: [e.message] }); }
};

export { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getProductsByCategory };
