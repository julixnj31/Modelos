const express = require("express");
const pqrsController = require("../controllers/pqrsController");

const router = express.Router();

// Las rutas solo conectan URL + metodo HTTP con el controlador.
router.get("/", pqrsController.obtenerTodas);
router.get("/:id", pqrsController.obtenerPorId);
router.post("/", pqrsController.crear);
router.put("/:id", pqrsController.actualizar);
router.delete("/:id", pqrsController.eliminar);

module.exports = router;
