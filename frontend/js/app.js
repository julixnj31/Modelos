// ============================================================
// app.js (frontend) - La página que ve el usuario
// Habla con la API del backend y pinta los datos de cada módulo:
// categorías, productos, usuarios, proveedores, clientes,
// ventas e inventario.
// ============================================================

// Dirección donde está corriendo el servidor de la API.
const API = 'http://localhost:3000';

// Guarda temporalmente qué categoría o producto se está editando.
// null = no se está editando nada en ese módulo.
let editingCategoryId = null;
let editingProductId = null;

// Este "mapa" guarda los productos ya cargados, para poder llenar
// el formulario al apretar "Editar" sin volver a pedir a la API.
let productsById = {};

// --- Pestañas ---
// Al hacer clic en una pestaña se le pone la clase "active" a esa
// pestaña y a su sección, y se la quita a las demás.
// Así solo se ve una sección a la vez.
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
// Sirve para los selects de categoría, proveedor, producto y usuario.
const fillSelect = async (elId, url, valueKey, labelKey) => {
  const res = await fetch(`${API}${url}`);
  const { data } = await res.json();
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

// Carga las categorías y las pinta en la tabla
async function loadCategories() {
  const res = await fetch(`${API}/categorias`);
  const { data } = await res.json();
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

// Botón "Agregar / Actualizar" categoría.
// Si hay una en edición hace PUT; si no, hace POST.
document.getElementById('add-category').addEventListener('click', async () => {
  const input = document.getElementById('category-name');
  const name = input.value.trim();
  if (!name) return alert('Ingrese un nombre');

  if (editingCategoryId) {
    await fetch(`${API}/categorias/${editingCategoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name })
    });
    editingCategoryId = null;
    document.getElementById('add-category').textContent = 'Agregar';
  } else {
    await fetch(`${API}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name })
    });
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

// Borra una categoría (debe estar vacía para poder borrarla)
async function deleteCategory(id) {
  if (!confirm('¿Eliminar categoría?')) return;
  const res = await fetch(`${API}/categorias/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadCategories();
}

// ============================================================
// PRODUCTOS (crud completo: ver, crear, editar y borrar)
// ============================================================

// Carga los productos con su categoría y los pinta
async function loadProducts() {
  const res = await fetch(`${API}/productos`);
  const { data } = await res.json();
  const catsRes = await fetch(`${API}/categorias`);
  const { data: cats } = await catsRes.json();
  const catMap = {};
  cats.forEach(c => catMap[c.id] = c.nombre);

  productsById = {}; // Reinicia el mapa de productos
  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';
  data.forEach(prod => {
    productsById[prod.id] = prod; // Guarda cada producto para poder editarlo luego
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

// Botón "Agregar / Actualizar" producto.
// Junta los campos del formulario y hace POST (nuevo) o PUT (editar).
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

  const url = editingProductId ? `${API}/productos/${editingProductId}` : `${API}/productos`;
  const method = editingProductId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.success) return alert(data.message);

  // Limpia el formulario y vuelve a pintar la tabla
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

// Borra un producto
async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  const res = await fetch(`${API}/productos/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadProducts();
}

// ============================================================
// USUARIOS
// ============================================================

async function loadUsers() {
  const res = await fetch(`${API}/usuarios`);
  const { data } = await res.json();
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

// Botón "Agregar" usuario
document.getElementById('add-user').addEventListener('click', async () => {
  const nombre = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const password = document.getElementById('user-password').value;
  if (!nombre || !email || !password) return alert('Nombre, email y contraseña obligatorios');

  const res = await fetch(`${API}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      email,
      password,
      rol: document.getElementById('user-rol').value
    })
  });
  const data = await res.json();
  if (!data.success) return alert(data.message);

  document.getElementById('user-name').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('user-password').value = '';
  loadUsers();
});

// Borra un usuario
async function deleteUser(id) {
  if (!confirm('¿Eliminar usuario?')) return;
  const res = await fetch(`${API}/usuarios/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadUsers();
}

// ============================================================
// PROVEEDORES
// ============================================================

async function loadProviders() {
  const res = await fetch(`${API}/proveedores`);
  const { data } = await res.json();
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

// Botón "Agregar" proveedor
document.getElementById('add-provider').addEventListener('click', async () => {
  const nombre = document.getElementById('provider-name').value.trim();
  if (!nombre) return alert('El nombre es obligatorio');

  const res = await fetch(`${API}/proveedores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      contacto: document.getElementById('provider-contact').value.trim(),
      telefono: document.getElementById('provider-phone').value.trim(),
      email: document.getElementById('provider-email').value.trim(),
      direccion: document.getElementById('provider-address').value.trim()
    })
  });
  const data = await res.json();
  if (!data.success) return alert(data.message);

  ['provider-name', 'provider-contact', 'provider-phone', 'provider-email', 'provider-address']
    .forEach(id => document.getElementById(id).value = '');
  loadProviders();
  loadProducts();
});

// Borra un proveedor
async function deleteProvider(id) {
  if (!confirm('¿Eliminar proveedor?')) return;
  const res = await fetch(`${API}/proveedores/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadProviders();
}

// ============================================================
// CLIENTES
// ============================================================

async function loadClients() {
  const res = await fetch(`${API}/clientes`);
  const { data } = await res.json();
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

// Botón "Agregar" cliente
document.getElementById('add-client').addEventListener('click', async () => {
  const nombre = document.getElementById('client-name').value.trim();
  if (!nombre) return alert('El nombre es obligatorio');

  const res = await fetch(`${API}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      documento: document.getElementById('client-document').value.trim(),
      telefono: document.getElementById('client-phone').value.trim(),
      email: document.getElementById('client-email').value.trim(),
      direccion: document.getElementById('client-address').value.trim()
    })
  });
  const data = await res.json();
  if (!data.success) return alert(data.message);

  ['client-name', 'client-document', 'client-phone', 'client-email', 'client-address']
    .forEach(id => document.getElementById(id).value = '');
  loadClients();
});

// Borra un cliente
async function deleteClient(id) {
  if (!confirm('¿Eliminar cliente?')) return;
  const res = await fetch(`${API}/clientes/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadClients();
}

// ============================================================
// VENTAS
// ============================================================

// Muestra las ventas (se crean desde el backend con su detalle)
async function loadSales() {
  const res = await fetch(`${API}/ventas`);
  const { data } = await res.json();
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

// Borra una venta
async function deleteSale(id) {
  if (!confirm('¿Eliminar venta?')) return;
  const res = await fetch(`${API}/ventas/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadSales();
}

// ============================================================
// INVENTARIO (movimientos)
// ============================================================

// Muestra el historial de movimientos
async function loadInventory() {
  const res = await fetch(`${API}/inventario`);
  const { data } = await res.json();
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

// Botón "Registrar" movimiento (entrada / salida / ajuste)
document.getElementById('add-move').addEventListener('click', async () => {
  const res = await fetch(`${API}/inventario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      producto_id: Number(document.getElementById('move-product').value),
      usuario_id: Number(document.getElementById('move-user').value),
      tipo: document.getElementById('move-type').value,
      cantidad: Number(document.getElementById('move-qty').value),
      motivo: document.getElementById('move-reason').value.trim()
    })
  });
  const data = await res.json();
  if (!data.success) return alert(data.message);

  document.getElementById('move-qty').value = '';
  document.getElementById('move-reason').value = '';
  loadInventory();
  loadProducts(); // El stock de los productos cambió
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

// Carga todo apenas abre la página
setup().then(() => {
  loadCategories();
  loadProducts();
  loadUsers();
  loadProviders();
  loadClients();
  loadSales();
  loadInventory();
});