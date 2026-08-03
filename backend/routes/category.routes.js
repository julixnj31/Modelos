// ============================================================
// category.routes.js - Endpoints de categorías
// ============================================================

import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory, // Este es especial: trae los productos de una categoría
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories); // GET  /categorias -> lista todas
categoryRouter.get("/:id", getCategoryById); // GET  /categorias/2 -> busca una por id
categoryRouter.post("/", createCategory); // POST /categorias -> crea una
categoryRouter.put("/:id", updateCategory); // PUT  /categorias/2 -> edita
categoryRouter.delete("/:id", deleteCategory); // DELETE /categorias/2 -> borra

// Ruta relacional: productos que pertenecen a una categoría
// Ej: GET /categorias/2/products -> todos los productos de la categoría 2
categoryRouter.get("/:id/products", getProductsByCategory);

export default categoryRouter;