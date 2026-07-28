import express from "express";
import cors from "cors";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import userRouter from "./routes/user.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import clientRouter from "./routes/client.routes.js";
import saleRouter from "./routes/sale.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de Gestión de Inventario",
    data: [],
    errors: [],
  });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/suppliers", supplierRouter);
app.use("/clients", clientRouter);
app.use("/sales", saleRouter);
app.use("/inventory", inventoryRouter);

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});
