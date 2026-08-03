// ============================================================
// clientes.routes.js - Endpoints de clientes
// ============================================================

import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/client.controller.js";

const router = Router();
router.get("/", getAll); // GET  /clientes -> lista quién le compra al negocio
router.get("/:id", getById); // GET  /clientes/2 -> busca uno por id
router.post("/", create); // POST /clientes -> registra un cliente nuevo
router.put("/:id", update); // PUT  /clientes/2 -> edita sus datos
router.delete("/:id", remove); // DELETE /clientes/2 -> lo elimina
export default router;