let tareas = [
    {
        id: 1,
        titulo: "Estudiar JavaScript",
        descripcion: "Repasar funciones y módulos"
    },
    {
        id: 2,
        titulo: "Hacer ejercicio",
        descripcion: "Caminar durante 30 minutos"
    },
    {
        id: 3,
        titulo: "Comprar mercado",
        descripcion: "Comprar arroz, leche y huevos"
    }
];

export function obtenerTodas() {
    return tareas;
}

export function obtenerPorId(id) {
    return tareas.find(t => t.id == id);
}

export function crear(datos) {
    tareas.push(datos);
    return datos;
}

export function actualizar(id, datos) {
    const indice = tareas.findIndex(t => t.id == id);
    tareas[indice] = datos;
    return datos;
}

export function eliminar(id) {
    tareas = tareas.filter(t => t.id != id);
    return "Tarea eliminada";
}