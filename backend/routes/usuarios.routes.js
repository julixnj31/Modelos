// ============================================================
// usuarios.routes.js - Endpoints de usuarios del sistema
// ============================================================

import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/user.controller.js";

const router = Router();
router.get("/", getAll); // GET  /usuarios -> lista los que pueden entrar al sistema
router.get("/:id", getById); // GET  /usuarios/3 -> busca uno por id
router.post("/", create); // POST /usuarios -> registra un usuario nuevo
router.put("/:id", update); // PUT  /usuarios/3 -> edita datos del usuario
router.delete("/:id", remove); // DELETE /usuarios/3 -> lo saca del sistema
export default router;