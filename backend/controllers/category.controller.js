import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    res.status(200).json({
      success: true,
      message: "Lista de categorías",
      data: categories,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
      data: [],
      errors: [error.message],
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(Number(id));

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Categoría encontrada correctamente",
      data: category,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [error.message],
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
        data: [],
        errors: [],
      });
    }

    const newCategory = await CategoryModel.create({ name });
    res.status(201).json({
      success: true,
      message: "Categoría creada correctamente",
      data: newCategory,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear categoría",
      data: [],
      errors: [error.message],
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await CategoryModel.update(Number(id), req.body);

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: `Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      data: updatedCategory,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar categoría",
      data: [],
      errors: [error.message],
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryExists = await CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Categoría con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    const linkedProducts = await ProductModel.findByCategoryId(Number(id));
    if (linkedProducts && linkedProducts.length > 0) {
      return res.status(409).json({
        success: false,
        message: "No se puede eliminar la categoría porque tiene al menos un recurso vinculado",
        data: [],
        errors: [],
      });
    }

    await CategoryModel.delete(Number(id));
    res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar la categoría",
      data: [],
      errors: [error.message],
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryExists = await CategoryModel.findById(Number(id));
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: `La categoría con ID ${id} no existe`,
        data: [],
        errors: [],
      });
    }

    const products = await ProductModel.findByCategoryId(Number(id));
    res.status(200).json({
      success: true,
      message: `Productos de la categoría: ${categoryExists.name}`,
      data: products,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar los productos de la categoría",
      data: [],
      errors: [error.message],
    });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
};
