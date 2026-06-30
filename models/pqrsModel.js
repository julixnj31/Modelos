// Arreglo temporal para simular una base de datos
let pqrsList = [
  {
    id: 1,
    tipo: "Peticion",
    descripcion: "Necesito informacion sobre el horario de atencion.",
    estado: "Pendiente"
  },
  {
    id: 2,
    tipo: "Queja",
    descripcion: "La respuesta del servicio fue muy lenta.",
    estado: "Pendiente"
  }
];

let nextId = 3;

// El modelo solo maneja datos. No usa req, res ni respuestas HTTP.
const obtenerTodas = async () => {
  return pqrsList;
};

const obtenerPorId = async (id) => {
  return pqrsList.find((pqrs) => pqrs.id === Number(id)) || null;
};

const crear = async (datos) => {
  const nuevaPqrs = {
    id: nextId,
    tipo: datos.tipo,
    descripcion: datos.descripcion,
    estado: datos.estado || "Pendiente"
  };

  pqrsList.push(nuevaPqrs);
  nextId++;

  return nuevaPqrs;
};

const actualizar = async (id, datos) => {
  const pqrs = pqrsList.find((item) => item.id === Number(id));

  if (!pqrs) {
    return null;
  }

  pqrs.tipo = datos.tipo || pqrs.tipo;
  pqrs.descripcion = datos.descripcion || pqrs.descripcion;
  pqrs.estado = datos.estado || pqrs.estado;

  return pqrs;
};

const eliminar = async (id) => {
  const posicion = pqrsList.findIndex((pqrs) => pqrs.id === Number(id));

  if (posicion === -1) {
    return null;
  }

  const pqrsEliminada = pqrsList.splice(posicion, 1);

  return pqrsEliminada[0];
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
