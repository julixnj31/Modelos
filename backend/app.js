import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import proveedoresRouter from "./routes/proveedores.routes.js";
import clientesRouter from "./routes/clientes.routes.js";
import ventasRouter from "./routes/ventas.routes.js";
import inventarioRouter from "./routes/inventario.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/productos", productRouter);
app.use("/categorias", categoryRouter);
app.use("/usuarios", usuariosRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/clientes", clientesRouter);
app.use("/ventas", ventasRouter);
app.use("/inventario", inventarioRouter);

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});
