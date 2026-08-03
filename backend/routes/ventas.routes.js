// ============================================================
// ventas.routes.js - Endpoints de ventas
// ============================================================

import { Router } from "express";
// Nota: las ventas no se editan directamente (sólo ver, crear y borrar)
import { getAll, getById, create, remove } from "../controllers/sale.controller.js";

const router = Router();
router.get("/", getAll); // GET  /ventas -> todas las ventas hechas
router.get("/:id", getById); // GET  /ventas/7 -> busca una por id (incluye su detalle)
router.post("/", create); // POST /ventas -> registra una venta nueva (descuenta stock)
router.delete("/:id", remove); // DELETE /ventas/7 -> la elimina
export default router;