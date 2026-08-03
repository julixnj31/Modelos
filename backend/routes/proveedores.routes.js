// ============================================================
// proveedores.routes.js - Endpoints de proveedores
// ============================================================

import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/supplier.controller.js";

const router = Router();
router.get("/", getAll); // GET  /proveedores -> lista a quién le compra el negocio
router.get("/:id", getById); // GET  /proveedores/2 -> busca uno por id
router.post("/", create); // POST /proveedores -> agrega un proveedor nuevo
router.put("/:id", update); // PUT  /proveedores/2 -> edita sus datos
router.delete("/:id", remove); // DELETE /proveedores/2 -> lo elimina
export default router;