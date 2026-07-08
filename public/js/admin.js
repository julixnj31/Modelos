const usuario = requireSession(["admin"]);

document.getElementById("logout-btn").addEventListener("click", cerrarSesion);

let usersCache = [];

// ---------- Tabs ----------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-usuarios").style.display = btn.dataset.tab === "usuarios" ? "block" : "none";
    document.getElementById("tab-tareas").style.display = btn.dataset.tab === "tareas" ? "block" : "none";
  });
});

// ---------- Dashboard ----------
const cargarDashboard = async () => {
  try {
    const stats = await apiFetch("/dashboard");
    const grid = document.getElementById("stats-grid");
    grid.innerHTML = `
      <div class="stat-tile"><div class="value">${stats.totalUsuarios}</div><div class="label">Usuarios</div></div>
      <div class="stat-tile"><div class="value">${stats.totalTareas}</div><div class="label">Tareas</div></div>
      <div class="stat-tile"><div class="value">${stats.porStatus.pendiente || 0}</div><div class="label">Pendientes</div></div>
      <div class="stat-tile"><div class="value">${stats.porStatus.en_progreso || 0}</div><div class="label">En progreso</div></div>
      <div class="stat-tile"><div class="value">${stats.porStatus.completada || 0}</div><div class="label">Completadas</div></div>
      <div class="stat-tile"><div class="value">${stats.tareasSinAsignar}</div><div class="label">Sin asignar</div></div>
    `;
  } catch (error) {
    alert(error.message);
  }
};

// ---------- Usuarios ----------
const userForm = document.getElementById("user-form");
const userError = document.getElementById("user-error");

const renderUsers = () => {
  const tbody = document.getElementById("users-body");
  tbody.innerHTML = "";

  usersCache.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>
        <button class="secondary" data-action="edit" data-id="${user.id}">Editar</button>
        <button class="secondary" data-action="toggle" data-id="${user.id}" data-status="${user.status}">
          ${user.status === "active" ? "Desactivar" : "Activar"}
        </button>
        <button class="danger" data-action="delete" data-id="${user.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-action='edit']").forEach((btn) => {
    btn.addEventListener("click", () => cargarUsuarioEnFormulario(btn.dataset.id));
  });
  tbody.querySelectorAll("button[data-action='toggle']").forEach((btn) => {
    btn.addEventListener("click", () => toggleUserStatus(btn.dataset.id, btn.dataset.status));
  });
  tbody.querySelectorAll("button[data-action='delete']").forEach((btn) => {
    btn.addEventListener("click", () => eliminarUsuario(btn.dataset.id));
  });
};

const cargarUsuarios = async () => {
  try {
    usersCache = await apiFetch("/users");
    renderUsers();
    poblarSelectsDeUsuarios();
  } catch (error) {
    alert(error.message);
  }
};

const cargarUsuarioEnFormulario = (id) => {
  const user = usersCache.find((u) => u.id === Number(id));
  if (!user) return;

  document.getElementById("user-form-title").textContent = `Editar usuario: ${user.name}`;
  document.getElementById("user-id").value = user.id;
  document.getElementById("user-name").value = user.name;
  document.getElementById("user-email").value = user.email;
  document.getElementById("user-password").value = "";
  document.getElementById("password-hint").textContent = "(dejar vacio para no cambiarla)";
  document.getElementById("user-role").value = user.role;
};

const limpiarFormularioUsuario = () => {
  userForm.reset();
  document.getElementById("user-id").value = "";
  document.getElementById("user-form-title").textContent = "Crear usuario";
  document.getElementById("password-hint").textContent = "";
};

document.getElementById("user-form-cancel").addEventListener("click", limpiarFormularioUsuario);

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  userError.textContent = "";

  const id = document.getElementById("user-id").value;
  const payload = {
    name: document.getElementById("user-name").value,
    email: document.getElementById("user-email").value,
    role: document.getElementById("user-role").value
  };

  const password = document.getElementById("user-password").value;
  if (password) payload.password = password;

  try {
    if (id) {
      await apiFetch(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    } else {
      if (!password) {
        userError.textContent = "La contrasena es obligatoria para crear un usuario";
        return;
      }
      await apiFetch("/users", { method: "POST", body: JSON.stringify(payload) });
    }

    limpiarFormularioUsuario();
    cargarUsuarios();
  } catch (error) {
    userError.textContent = error.message;
  }
});

const toggleUserStatus = async (id, statusActual) => {
  const nuevoStatus = statusActual === "active" ? "inactive" : "active";
  try {
    await apiFetch(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nuevoStatus })
    });
    cargarUsuarios();
  } catch (error) {
    alert(error.message);
  }
};

const eliminarUsuario = async (id) => {
  if (!confirm("Seguro que deseas eliminar este usuario?")) return;
  try {
    await apiFetch(`/users/${id}`, { method: "DELETE" });
    cargarUsuarios();
  } catch (error) {
    alert(error.message);
  }
};

// ---------- Tareas ----------
const taskForm = document.getElementById("task-form");
const taskError = document.getElementById("task-error");

const poblarSelectsDeUsuarios = () => {
  const checkboxesContainer = document.getElementById("task-users-checkboxes");
  checkboxesContainer.innerHTML = usersCache
    .map((user) => `
      <label>
        <input type="checkbox" value="${user.id}" />
        ${user.name} (${user.email})
      </label>
    `)
    .join("");

  const filterSelect = document.getElementById("filter-user");
  filterSelect.innerHTML =
    '<option value="">Todos</option>' +
    usersCache.map((user) => `<option value="${user.id}">${user.name}</option>`).join("");
};

const nombreUsuario = (id) => {
  const user = usersCache.find((u) => u.id === Number(id));
  return user ? user.name : `Usuario #${id}`;
};

const renderTasks = (tasks) => {
  const tbody = document.getElementById("tasks-body");
  tbody.innerHTML = "";

  tasks.forEach((task) => {
    const tr = document.createElement("tr");
    const asignadosHtml = task.assignedUsers
      .map(
        (userId) => `
        <span class="badge media" style="background:#52606d;">
          ${nombreUsuario(userId)}
          <button data-remove-task="${task.id}" data-remove-user="${userId}" style="border:none;background:transparent;color:#fff;cursor:pointer;">x</button>
        </span>`
      )
      .join(" ");

    tr.innerHTML = `
      <td>${task.title}<br/><small>${task.description}</small></td>
      <td><span class="badge ${task.priority}">${task.priority}</span></td>
      <td>
        <select data-status-for="${task.id}">
          <option value="pendiente" ${task.status === "pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="en_progreso" ${task.status === "en_progreso" ? "selected" : ""}>En progreso</option>
          <option value="completada" ${task.status === "completada" ? "selected" : ""}>Completada</option>
        </select>
      </td>
      <td>${asignadosHtml || "-"}</td>
      <td><button class="danger" data-delete-task="${task.id}">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("select[data-status-for]").forEach((select) => {
    select.addEventListener("change", () => actualizarEstadoTarea(select.dataset.statusFor, select.value));
  });
  tbody.querySelectorAll("button[data-remove-user]").forEach((btn) => {
    btn.addEventListener("click", () => quitarUsuarioDeTarea(btn.dataset.removeTask, btn.dataset.removeUser));
  });
  tbody.querySelectorAll("button[data-delete-task]").forEach((btn) => {
    btn.addEventListener("click", () => eliminarTarea(btn.dataset.deleteTask));
  });
};

const cargarTareas = async () => {
  try {
    const tasks = await apiFetch("/tasks");
    renderTasks(tasks);
  } catch (error) {
    alert(error.message);
  }
};

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  taskError.textContent = "";

  const userIds = Array.from(
    document.querySelectorAll("#task-users-checkboxes input:checked")
  ).map((checkbox) => Number(checkbox.value));

  const payload = {
    title: document.getElementById("task-title").value,
    description: document.getElementById("task-description").value,
    priority: document.getElementById("task-priority").value,
    assignedUsers: userIds
  };

  try {
    await apiFetch("/tasks", { method: "POST", body: JSON.stringify(payload) });
    taskForm.reset();
    cargarTareas();
  } catch (error) {
    taskError.textContent = error.message;
  }
});

const actualizarEstadoTarea = async (taskId, status) => {
  try {
    await apiFetch(`/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    cargarTareas();
  } catch (error) {
    alert(error.message);
  }
};

const quitarUsuarioDeTarea = async (taskId, userId) => {
  try {
    await apiFetch(`/tasks/${taskId}/users/${userId}`, { method: "DELETE" });
    cargarTareas();
  } catch (error) {
    alert(error.message);
  }
};

const eliminarTarea = async (taskId) => {
  if (!confirm("Seguro que deseas eliminar esta tarea?")) return;
  try {
    await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
    cargarTareas();
  } catch (error) {
    alert(error.message);
  }
};

// ---------- Filtros ----------
document.getElementById("filter-btn").addEventListener("click", async () => {
  const status = document.getElementById("filter-status").value;
  const priority = document.getElementById("filter-priority").value;
  const userId = document.getElementById("filter-user").value;

  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (priority) params.append("priority", priority);
  if (userId) params.append("userId", userId);

  try {
    const tasks = await apiFetch(`/tasks/filter?${params.toString()}`);
    renderTasks(tasks);
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("filter-clear-btn").addEventListener("click", () => {
  document.getElementById("filter-status").value = "";
  document.getElementById("filter-priority").value = "";
  document.getElementById("filter-user").value = "";
  cargarTareas();
});

// ---------- Inicializar ----------
if (usuario) {
  cargarDashboard();
  cargarUsuarios().then(cargarTareas);
}
