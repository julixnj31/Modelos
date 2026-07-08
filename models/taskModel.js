// Arreglo temporal para simular una base de datos de tareas.
let tasksList = [
  {
    id: 1,
    title: "Preparar informe mensual",
    description: "Consolidar los datos de ventas del mes y enviar el informe.",
    status: "pendiente",
    priority: "alta",
    assignedUsers: [2],
    dueDate: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Revisar solicitudes de soporte",
    description: "Revisar y responder las solicitudes pendientes de la semana.",
    status: "en_progreso",
    priority: "media",
    assignedUsers: [2, 3],
    dueDate: null,
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// El modelo solo maneja datos. No usa req, res ni respuestas HTTP.
const obtenerTodas = async () => {
  return tasksList;
};

const obtenerPorId = async (id) => {
  return tasksList.find((task) => task.id === Number(id)) || null;
};

const crear = async (datos) => {
  const nuevaTarea = {
    id: nextId,
    title: datos.title,
    description: datos.description,
    status: datos.status || "pendiente",
    priority: datos.priority || "media",
    assignedUsers: Array.isArray(datos.assignedUsers)
      ? datos.assignedUsers.map(Number)
      : [],
    dueDate: datos.dueDate || null,
    createdAt: new Date().toISOString()
  };

  tasksList.push(nuevaTarea);
  nextId++;

  return nuevaTarea;
};

const actualizar = async (id, datos) => {
  const task = tasksList.find((item) => item.id === Number(id));

  if (!task) {
    return null;
  }

  task.title = datos.title || task.title;
  task.description = datos.description || task.description;
  task.status = datos.status || task.status;
  task.priority = datos.priority || task.priority;
  task.dueDate = datos.dueDate || task.dueDate;

  if (Array.isArray(datos.assignedUsers)) {
    task.assignedUsers = datos.assignedUsers.map(Number);
  }

  return task;
};

const actualizarEstado = async (id, status) => {
  const task = tasksList.find((item) => item.id === Number(id));

  if (!task) {
    return null;
  }

  task.status = status;

  return task;
};

const eliminar = async (id) => {
  const posicion = tasksList.findIndex((task) => task.id === Number(id));

  if (posicion === -1) {
    return null;
  }

  const tareaEliminada = tasksList.splice(posicion, 1);

  return tareaEliminada[0];
};

// Agrega usuarios a la tarea sin duplicar los que ya estaban asignados.
const asignarUsuarios = async (id, userIds) => {
  const task = tasksList.find((item) => item.id === Number(id));

  if (!task) {
    return null;
  }

  const nuevosIds = userIds.map(Number);
  const combinados = new Set([...task.assignedUsers, ...nuevosIds]);
  task.assignedUsers = Array.from(combinados);

  return task;
};

const obtenerIdsUsuariosAsignados = async (id) => {
  const task = tasksList.find((item) => item.id === Number(id));

  if (!task) {
    return null;
  }

  return task.assignedUsers;
};

const quitarUsuario = async (id, userId) => {
  const task = tasksList.find((item) => item.id === Number(id));

  if (!task) {
    return null;
  }

  task.assignedUsers = task.assignedUsers.filter(
    (asignadoId) => asignadoId !== Number(userId)
  );

  return task;
};

const obtenerPorUsuario = async (userId) => {
  return tasksList.filter((task) => task.assignedUsers.includes(Number(userId)));
};

// Filtra tareas por status, prioridad, usuario asignado y rango de fechas.
const filtrar = async ({ status, priority, userId, desde, hasta }) => {
  return tasksList.filter((task) => {
    if (status && task.status !== status) return false;
    if (priority && task.priority !== priority) return false;
    if (userId && !task.assignedUsers.includes(Number(userId))) return false;

    if (desde && task.dueDate && new Date(task.dueDate) < new Date(desde)) return false;
    if (hasta && task.dueDate && new Date(task.dueDate) > new Date(hasta)) return false;

    return true;
  });
};

// Genera estadisticas generales para el panel de administracion.
const obtenerEstadisticas = async () => {
  const porStatus = {};
  const porPrioridad = {};
  const porUsuario = {};

  tasksList.forEach((task) => {
    porStatus[task.status] = (porStatus[task.status] || 0) + 1;
    porPrioridad[task.priority] = (porPrioridad[task.priority] || 0) + 1;

    task.assignedUsers.forEach((userId) => {
      porUsuario[userId] = (porUsuario[userId] || 0) + 1;
    });
  });

  return {
    totalTareas: tasksList.length,
    tareasSinAsignar: tasksList.filter((task) => task.assignedUsers.length === 0).length,
    porStatus,
    porPrioridad,
    porUsuario
  };
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  actualizarEstado,
  eliminar,
  asignarUsuarios,
  obtenerIdsUsuariosAsignados,
  quitarUsuario,
  obtenerPorUsuario,
  filtrar,
  obtenerEstadisticas
};
