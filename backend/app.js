// ============================================================
// app.js - El "cerebro" del servidor
// Aquí se crea la API, se le dice qué librerías usar
// y se conectan todas las rutas del sistema de inventario.
// ============================================================

import express from "express";
import cors from "cors";

// Rutas de cada módulo del sistema (productos, categorías, etc.)
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import proveedoresRouter from "./routes/proveedores.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import ventasRouter from "./routes/ventas.routes.js";
import inventarioRouter from "./routes/inventario.routes.js";

// Se crea la aplicación Express (el servidor web)
const app = express();

// Middlewares: cosas que se ejecutan antes de llegar a las rutas
app.use(cors()); // Permite que el frontend (otro puerto) pueda llamar la API
app.use(express.json()); // Sirve para leer JSON que envíe el cliente
app.use(express.urlencoded({ extended: true })); // También acepta formularios normales

// Ruta principal: solo es un mensaje de bienvenida para saber que la API vive
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de Gestión de Inventario",
    data: [],
    errors: [],
  });
});

// Aquí se "montan" todas las rutas del sistema
// Cada una responde en su propio camino, ej: /productos, /ventas
app.use("/productos", productRouter);
app.use("/categorias", categoryRouter);
app.use("/usuarios", usuariosRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/clientes", clientesRouter);
app.use("/ventas", ventasRouter);
app.use("/inventario", inventarioRouter);

// Puerto donde se enciende el servidor (para desarrollo)
const PORT = 3000;

// Enciende el servidor y avisa en la consola cuando ya está listo
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});
