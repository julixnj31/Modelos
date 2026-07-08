const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = 3000;

// Permite recibir datos en formato JSON desde el cliente.
app.use(express.json());

// Sirve el frontend estatico (login, panel admin, panel usuario).
app.use(express.static(path.join(__dirname, "public")));

// Ruta para comprobar que el servidor esta funcionando.
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Sistema de Tareas funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

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
