const usuario = requireSession(["user", "admin"]);

document.getElementById("logout-btn").addEventListener("click", cerrarSesion);

if (usuario) {
  document.getElementById("saludo").textContent = `Hola, ${usuario.name}`;
}

const renderTasks = (tasks) => {
  const tbody = document.getElementById("tasks-body");
  const emptyMessage = document.getElementById("empty-message");
  tbody.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  tasks.forEach((task) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td><span class="badge ${task.priority}">${task.priority}</span></td>
      <td><span class="badge ${task.status}">${task.status}</span></td>
      <td>
        ${
          task.status !== "completada"
            ? `<button class="secondary" data-id="${task.id}">Marcar como completada</button>`
            : "-"
        }
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => marcarCompletada(btn.dataset.id));
  });
};

const cargarTareas = async () => {
  try {
    const tasks = await apiFetch(`/users/${usuario.id}/tasks`);
    renderTasks(tasks);
  } catch (error) {
    alert(error.message);
  }
};

const marcarCompletada = async (taskId) => {
  try {
    await apiFetch(`/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "completada" })
    });
    cargarTareas();
  } catch (error) {
    alert(error.message);
  }
};

if (usuario) {
  cargarTareas();
}
