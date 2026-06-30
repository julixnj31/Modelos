const express = require("express");
const pqrsRoutes = require("./routes/pqrsRoutes");

const app = express();
const PORT = 3000;

// Permite recibir datos en formato JSON desde el cliente.
app.use(express.json());

// Ruta principal para comprobar que el servidor esta funcionando.
app.get("/", (req, res) => {
  res.status(200).json({ message: "Sistema PQRS funcionando" });
});

// Todas las rutas de PQRS empiezan por /api/pqrs.
app.use("/api/pqrs", pqrsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
