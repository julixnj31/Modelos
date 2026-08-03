// ============================================================
// product.routes.js - Endpoints de productos
// Define qué URL responde cada función del controlador.
// ============================================================

import { Router } from "express";
// Funciones que hacen el trabajo real (están en el controlador)
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", getAllProducts); // GET  /productos -> lista todos
productRouter.get("/:id", getProductById); // GET  /productos/5 -> busca uno por id
productRouter.post("/", createProduct); // POST /productos -> crea uno nuevo
productRouter.put("/:id", updateProduct); // PUT  /productos/5 -> actualiza el 5
productRouter.delete("/:id", deleteProduct); // DELETE /productos/5 -> borra el 5

export default productRouter;