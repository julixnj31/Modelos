const express = require("express");
const userController = require("../controllers/userController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);

router.get("/:userId/tasks", userController.obtenerTareasDeUsuario);

router.post("/", requireRole("admin"), userController.crear);
router.get("/", requireRole("admin"), userController.obtenerTodos);
router.get("/:id", requireRole("admin"), userController.obtenerPorId);
router.put("/:id", requireRole("admin"), userController.actualizar);
router.patch("/:id/status", requireRole("admin"), userController.actualizarStatus);
router.delete("/:id", requireRole("admin"), userController.eliminar);

module.exports = router;
