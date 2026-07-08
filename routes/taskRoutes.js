const express = require("express");
const taskController = require("../controllers/taskController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);

// IMPORTANTE: /filter debe ir antes de /:id para que Express no lo confunda con un id.
router.get("/filter", requireRole("admin"), taskController.filtrar);

router.post("/", requireRole("admin"), taskController.crear);
router.get("/", requireRole("admin"), taskController.obtenerTodas);
router.get("/:id", taskController.obtenerPorId);
router.put("/:id", requireRole("admin"), taskController.actualizar);
router.patch("/:id/status", taskController.actualizarEstado);
router.delete("/:id", requireRole("admin"), taskController.eliminar);

router.post("/:taskId/assign", requireRole("admin"), taskController.asignar);
router.get("/:taskId/users", requireRole("admin"), taskController.obtenerUsuariosAsignados);
router.delete("/:taskId/users/:userId", requireRole("admin"), taskController.quitarUsuario);

module.exports = router;
