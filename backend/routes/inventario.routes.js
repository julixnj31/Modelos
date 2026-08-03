// ============================================================
// inventario.routes.js - Endpoints de movimientos de inventario
// ============================================================

import { Router } from "express";
import { getAll, create } from "../controllers/inventory.controller.js";

const router = Router();
router.get("/", getAll); // GET  /inventario -> historial de movimientos (entradas/salidas/ajustes)
router.post("/", create); // POST /inventario -> registra un movimiento y actualiza stock
export default router;