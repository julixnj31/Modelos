import express from "express";
import cors from "cors";
import pqrsRoutes from "./routes/pqrsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "¡Bienvenido a la API del Sistema PQRS!",
        autor: "yoinel martinez",
        version: "1.0",
        rutas: {
            obtenerTodas: "/pqrs",
            obtenerPorId: "/pqrs/1"
        }
    });
});

app.use("/pqrs", pqrsRoutes);

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});