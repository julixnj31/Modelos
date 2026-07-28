const bcrypt = require("bcryptjs");

// Arreglo temporal para simular una base de datos de usuarios.
let usersList = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@demo.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    status: "active"
  },
  {
    id: 2,
    name: "Juan Perez",
    email: "juan@demo.com",
    password: bcrypt.hashSync("juan123", 10),
    role: "user",
    status: "active"
  },
  {
    id: 3,
    name: "Maria Lopez",
    email: "maria@demo.com",
    password: bcrypt.hashSync("maria123", 10),
    role: "user",
    status: "active"
  }
];

let nextId = 4;

// El modelo solo maneja datos. No usa req, res ni respuestas HTTP.
const obtenerTodas = async () => {
  return usersList;
};

const obtenerPorId = async (id) => {
  return usersList.find((user) => user.id === Number(id)) || null;
};

const obtenerPorEmail = async (email) => {
  return usersList.find((user) => user.email === email) || null;
};

const crear = async (datos) => {
  const passwordHash = bcrypt.hashSync(datos.password, 10);

  const nuevoUsuario = {
    id: nextId,
    name: datos.name,
    email: datos.email,
    password: passwordHash,
    role: datos.role || "user",
    status: "active"
  };

  usersList.push(nuevoUsuario);
  nextId++;

  return nuevoUsuario;
};

const actualizar = async (id, datos) => {
  const user = usersList.find((item) => item.id === Number(id));

  if (!user) {
    return null;
  }

  user.name = datos.name || user.name;
  user.email = datos.email || user.email;
  user.role = datos.role || user.role;

  if (datos.password) {
    user.password = bcrypt.hashSync(datos.password, 10);
  }

  return user;
};

const actualizarStatus = async (id, status) => {
  const user = usersList.find((item) => item.id === Number(id));

  if (!user) {
    return null;
  }

  user.status = status;

  return user;
};

const eliminar = async (id) => {
  const posicion = usersList.findIndex((user) => user.id === Number(id));

  if (posicion === -1) {
    return null;
  }

  const usuarioEliminado = usersList.splice(posicion, 1);

  return usuarioEliminado[0];
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  obtenerPorEmail,
  crear,
  actualizar,
  actualizarStatus,
  eliminar
};
