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

// Intenta levantar el servidor en un puerto.
// Si el puerto esta ocupado, prueba con el siguiente.
const iniciarServidor = (puerto) => {
  const server = app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`El puerto ${puerto} esta ocupado. Probando con ${puerto + 1}...`);
      iniciarServidor(puerto + 1);
    } else {
      console.log("Error al iniciar el servidor:", error.message);
    }
  });
};

iniciarServidor(PORT);
