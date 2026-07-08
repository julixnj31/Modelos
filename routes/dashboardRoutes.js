const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, requireRole("admin"), dashboardController.obtenerEstadisticas);

module.exports = router;
