// ============================================================
// auth.routes.js - Endpoints de autenticación
// ============================================================

import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/", login); // POST /login -> inicia sesión y entrega token

export default router;