import { Router } from "express";
import { getAll, getById, create, remove } from "../controllers/sale.controller.js";

const router = Router();
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.delete("/:id", remove);
export default router;
