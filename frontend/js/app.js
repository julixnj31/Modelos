// ============================================================
// app.js (frontend) - La página que ve el usuario
// Habla con la API del backend y pinta los datos de cada módulo:
// categorías, productos, usuarios, proveedores, clientes,
// ventas e inventario. Antes de todo pide iniciar sesión.
// ============================================================

// Dirección donde está corriendo el servidor de la API.
const API = 'http://localhost:3000';

// Token de la sesión: se guarda en el navegador para recordar
// quién entró, aunque se recargue la página.
let token = localStorage.getItem('api_token') || null;
let currentUser = JSON.parse(localStorage.getItem('api_user') || 'null');

// editingCategoryId / editingProductId: qué categoría o producto
// se está editando (null = no se edita).
let editingCategoryId = null;
let editingProductId = null;

// Mapa de productos ya cargados, para llenar el formulario al editar
let productsById = {};

// --- Llamadas a la API con token ---
// Todas las peticiones pasan por aquí: agrega la cabecera de autorización.
// Si la sesión expiró (401), cierra sesión y vuelve a la pantalla de login.
const api = async (path, opts = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + path, { ...opts, headers });
  if (res.status === 401) {
    logout();
    throw new Error('Sesión expirada, vuelve a entrar');
  }
  return res.json();
};

// --- Login / Logout ---
// "Entrar": manda email y contraseña; si son válidos guarda el token
// en el navegador y muestra la aplicación.
const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';
  if (!email || !password) return errorEl.textContent = 'Ingresa email y contraseña';

  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!data.success) return errorEl.textContent = data.message;

  token = data.data.token;
  currentUser = data.data.user;
  localStorage.setItem('api_token', token);
  localStorage.setItem('api_user', JSON.stringify(currentUser));
  enterApp();
});

// "Salir": borra el token y vuelve a la pantalla de login
function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('api_token');
  localStorage.removeItem('api_user');
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-view').style.display = 'block';
}

// Entrar a la aplicación: muestra la app, el nombre del usuario,
// llena los selects y carga todas las tablas.
const enterApp = async () => {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('user-info').textContent = `${currentUser.nombre} (${currentUser.rol})`;
  await setup();
  loadCategories();
  loadProducts();
  loadUsers();
  loadProviders();
  loadClients();
  loadSales();
  loadInventory();
};

document.getElementById('logout-btn').addEventListener('click', logout);

// Si ya había una sesión guardada, entra directo (si el token no sirve,
// la primera petición devolverá 401 y mandará a login).
if (token) enterApp();

// --- Pestañas ---
// Al hacer clic en una pestaña se marca como activa y se muestra
// solo su sección (las demás se ocultan).
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-section').classList.add('active');
  });
});

// --- Ayudante: llenar un <select> desde una ruta de la API ---
// Ej: fillSelect('product-category', '/categorias', 'id', 'nombre')
const fillSelect = async (elId, url, valueKey, labelKey) => {
  const { data } = await api(url);
  const el = document.getElementById(elId);
  el.innerHTML = '';
  data.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item[valueKey];
    opt.textContent = item[labelKey];
    el.appendChild(opt);
  });
};

// ============================================================
// CATEGORÍAS
// ============================================================

async function loadCategories() {
  const { data } = await api('/categorias');
  const tbody = document.getElementById('categories-body');
  tbody.innerHTML = '';
  data.forEach(cat => {
    tbody.innerHTML += `
      <tr>
        <td>${cat.id}</td>
        <td>${cat.nombre}</td>
        <td class="actions">
          <button class="edit" onclick="editCategory(${cat.id}, '${cat.nombre}')">Editar</button>
          <button class="delete" onclick="deleteCategory(${cat.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

// Botón "Agregar / Actualizar" categoría (PUT si edita, POST si nueva)
document.getElementById('add-category').addEventListener('click', async () => {
  const input = document.getElementById('category-name');
  const name = input.value.trim();
  if (!name) return alert('Ingrese un nombre');

  if (editingCategoryId) {
    await api(`/categorias/${editingCategoryId}`, { method: 'PUT', body: JSON.stringify({ nombre: name }) });
    editingCategoryId = null;
    document.getElementById('add-category').textContent = 'Agregar';
  } else {
    await api('/categorias', { method: 'POST', body: JSON.stringify({ nombre: name }) });
  }

  input.value = '';
  loadCategories();
});

// "Editar" de categoría: trae el nombre al campo de texto
function editCategory(id, name) {
  editingCategoryId = id;
  document.getElementById('category-name').value = name;
  document.getElementById('add-category').textContent = 'Actualizar';
}

async function deleteCategory(id) {
  if (!confirm('¿Eliminar categoría?')) return;
  const data = await api(`/categorias/${id}`, { method: 'DELETE' });
  if (!data.success) return alert(data.message);
  loadCategories();
}

// ============================================================
// PRODUCTOS
// ============================================================

async function loadProducts() {
  const { data } = await api('/productos');
  const catsRes = await api('/categorias');
  const catMap = {};
  catsRes.data.forEach(c => catMap[c.id] = c.nombre);

  productsById = {};
  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';
  data.forEach(prod => {
    productsById[prod.id] = prod;
    tbody.innerHTML += `
      <tr>
        <td>${prod.id}</td>
        <td>${prod.nombre}</td>
        <td>$${prod.precio}</td>
        <td>${catMap[prod.categoria_id] || 'Sin categoría'}</td>
        <td>${prod.stock}</td>
        <td class="actions">
          <button class="edit" onclick="editProduct(${prod.id})">Editar</button>
          <button class="delete" onclick="deleteProduct(${prod.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

// Botón "Agregar / Actualizar" producto
document.getElementById('add-product').addEventListener('click', async () => {
  const nombre = document.getElementById('product-name').value.trim();
  const precio = document.getElementById('product-price').value;
  if (!nombre || !precio) return alert('Nombre y precio son obligatorios');

  const body = {
    nombre,
    precio,
    categoria_id: Number(document.getElementById('product-category').value),
    proveedor_id: Number(document.getElementById('product-provider').value) || null,
    stock: Number(document.getElementById('product-stock').value) || 0,
    stock_minimo: Number(document.getElementById('product-minstock').value) || 0
  };

  const url = editingProductId ? `/productos/${editingProductId}` : '/productos';
  const method = editingProductId ? 'PUT' : 'POST';
  const data = await api(url, { method, body: JSON.stringify(body) });
  if (!data.success) return alert(data.message);

  editingProductId = null;
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-stock').value = '';
  document.getElementById('product-minstock').value = '';
  document.getElementById('add-product').textContent = 'Agregar';
  loadProducts();
});

// "Editar" de producto: llena el formulario con los datos guardados
function editProduct(id) {
  const prod = productsById[id];
  if (!prod) return;
  editingProductId = id;
  document.getElementById('product-name').value = prod.nombre;
  document.getElementById('product-price').value = prod.precio;
  document.getElementById('product-category').value = prod.categoria_id;
  document.getElementById('product-provider').value = prod.proveedor_id || '';
  document.getElementById('product-stock').value = prod.stock;
  document.getElementById('product-minstock').value = prod.stock_minimo;
  document.getElementById('add-product').textContent = 'Actualizar';
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  const data = await api(`/productos/${id}`, { method: 'DELETE' });
  if (!data.success) return alert(data.message);
  loadProducts();
}

// ============================================================
// USUARIOS
// ============================================================

async function loadUsers() {
  const { data } = await api('/usuarios');
  const tbody = document.getElementById('users-body');
  tbody.innerHTML = '';
  data.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>${u.rol}</td>
        <td class="actions">
          <button class="delete" onclick="deleteUser(${u.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

document.getElementById('add-user').addEventListener('click', async () => {
  const nombre = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const password = document.getElementById('user-password').value;
  if (!nombre || !email || !password) return alert('Nombre, email y contraseña obligatorios');

  const data = await api('/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password, rol: document.getElementById('user-rol').value })
  });
  if (!data.success) return alert(data.message);

  document.getElementById('user-name').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('user-password').value = '';
  loadUsers();
});

async function deleteUser(id) {
  if (!confirm('¿Eliminar usuario?')) return;
  const data = await api(`/usuarios/${id}`, { method: 'DELETE' });
  if (!data.success) return alert(data.message);
  loadUsers();
}

// ============================================================
// PROVEEDORES
// ============================================================

async function loadProviders() {
  const { data } = await api('/proveedores');
  const tbody = document.getElementById('providers-body');
  tbody.innerHTML = '';
  data.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.contacto || ''}</td>
        <td>${p.telefono || ''}</td>
        <td>${p.email || ''}</td>
        <td class="actions">
          <button class="delete" onclick="deleteProvider(${p.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

document.getElementById('add-provider').addEventListener('click', async () => {
  const nombre = document.getElementById('provider-name').value.trim();
  if (!nombre) return alert('El nombre es obligatorio');

  const data = await api('/proveedores', {
    method: 'POST',
    body: JSON.stringify({
      nombre,
      contacto: document.getElementById('provider-contact').value.trim(),
      telefono: document.getElementById('provider-phone').value.trim(),
      email: document.getElementById('provider-email').value.trim(),
      direccion: document.getElementById('provider-address').value.trim()
    })
  });
  if (!data.success) return alert(data.message);

  ['provider-name', 'provider-contact', 'provider-phone', 'provider-email', 'provider-address']
    .forEach(id => document.getElementById(id).value = '');
  loadProviders();
  loadProducts();
});

async function deleteProvider(id) {
  if (!confirm('¿Eliminar proveedor?')) return;
  const data = await api(`/proveedores/${id}`, { method: 'DELETE' });
  if (!data.success) return alert(data.message);
  loadProviders();
}

// ============================================================
// CLIENTES
// ============================================================

async function loadClients() {
  const { data } = await api('/clientes');
  const tbody = document.getElementById('clients-body');
  tbody.innerHTML = '';
  data.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.documento || ''}</td>
        <td>${c.telefono || ''}</td>
        <td>${c.email || ''}</td>
        <td class="actions">
          <button class="delete" onclick="deleteClient(${c.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

document.getElementById('add-client').addEventListener('click', async () => {
  const nombre = document.getElementById('client-name').value.trim();
  if (!nombre) return alert('El nombre es obligatorio');

  const data = await api('/clientes', {
    method: 'POST',
    body: JSON.stringify({
      nombre,
      documento: document.getElementById('client-document').value.trim(),
      telefono: document.getElementById('client-phone').value.trim(),
      email: document.getElementById('client-email').value.trim(),
      direccion: document.getElementById('client-address').value.trim()
    })
  });
  if (!data.success) return alert(data.message);

  ['client-name', 'client-document', 'client-phone', 'client-email', 'client-address']
    .forEach(id => document.getElementById(id).value = '');
  loadClients();
});

async function deleteClient(id) {
  if (!confirm('¿Eliminar cliente?')) return;
  const data = await api(`/clientes/${id}`, { method: 'DELETE' });
  if (!data.success) return alert(data.message);
  loadClients();
}

// ============================================================
// VENTAS
// ============================================================

async function loadSales() {
  const { data } = await api('/ventas');
  const tbody = document.getElementById('sales-body');
  tbody.innerHTML = '';
  data.forEach(v => {
    tbody.innerHTML += `
      <tr>
        <td>${v.id}</td>
        <td>${v.cliente_nombre || 'Mostrador'}</td>
        <td>${v.usuario_nombre || ''}</td>
        <td>$${v.total}</td>
        <td>${v.estado}</td>
        <td>${new Date(v.creado_en).toLocaleString()}</td>
        <td class="actions">
          <button class="delete" onclick="deleteSale(${v.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

async function deleteSale(id) {
  if (!confirm('¿Eliminar venta?')) return;
  const data = await api(`/ventas/${id}`, { method: 'DELETE' });
  if (!data.success) return alert(data.message);
  loadSales();
}

// ============================================================
// INVENTARIO
// ============================================================

async function loadInventory() {
  const { data } = await api('/inventario');
  const tbody = document.getElementById('inventory-body');
  tbody.innerHTML = '';
  data.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.id}</td>
        <td>${m.producto_nombre || m.producto_id}</td>
        <td>${m.usuario_nombre || m.usuario_id}</td>
        <td>${m.tipo}</td>
        <td>${m.cantidad}</td>
        <td>${m.stock_anterior}</td>
        <td>${m.stock_nuevo}</td>
        <td>${m.motivo || ''}</td>
        <td>${new Date(m.creado_en).toLocaleString()}</td>
      </tr>`;
  });
}

document.getElementById('add-move').addEventListener('click', async () => {
  const data = await api('/inventario', {
    method: 'POST',
    body: JSON.stringify({
      producto_id: Number(document.getElementById('move-product').value),
      usuario_id: Number(document.getElementById('move-user').value),
      tipo: document.getElementById('move-type').value,
      cantidad: Number(document.getElementById('move-qty').value),
      motivo: document.getElementById('move-reason').value.trim()
    })
  });
  if (!data.success) return alert(data.message);

  document.getElementById('move-qty').value = '';
  document.getElementById('move-reason').value = '';
  loadInventory();
  loadProducts();
});

// ============================================================
// ARRANQUE
// ============================================================

// Llena los selects que dependen de otras tablas
const setup = async () => {
  await fillSelect('product-category', '/categorias', 'id', 'nombre');
  await fillSelect('product-provider', '/proveedores', 'id', 'nombre');
  await fillSelect('move-product', '/productos', 'id', 'nombre');
  await fillSelect('move-user', '/usuarios', 'id', 'nombre');
};