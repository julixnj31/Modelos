// Wrapper de fetch que agrega el token JWT y maneja sesion expirada.
const API_BASE = "/api";

const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/index.html";
};

const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    cerrarSesion();
    throw new Error("Sesion expirada");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Error en la peticion");
  }

  return data;
};

const requireSession = (rolesPermitidos) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    window.location.href = "/index.html";
    return null;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(user.role)) {
    window.location.href = user.role === "admin" ? "/admin.html" : "/user.html";
    return null;
  }

  return user;
};
