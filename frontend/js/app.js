// ============================================================
// app.js (frontend) - La página que ve el usuario
// Aquí se habla con la API del backend y se pintan los datos
// en la tabla de categorías y productos.
// ============================================================

// Dirección del servidor de la API (debe estar encendido para que esto funcione)
const API = 'http://localhost:3000';

// Guarda temporalmente qué categoría se está editando (null = no se edita)
let editingCategoryId = null;

// --- Cambio de pestañas (Categorías / Productos) ---
// Al hacer clic en una pestaña, se marca como activa y se muestra su sección
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-section').classList.add('active');
  });
});

// --- Cargar la lista de categorías desde la API y pintarla en la tabla ---
async function loadCategories() {
  const res = await fetch(`${API}/categories`);
  const { data } = await res.json();
  const tbody = document.getElementById('categories-body');
  tbody.innerHTML = '';
  data.forEach(cat => {
    tbody.innerHTML += `
      <tr>
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td class="actions">
          <button class="edit" onclick="editCategory(${cat.id}, '${cat.name}')">Editar</button>
          <button class="delete" onclick="deleteCategory(${cat.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

// --- Cargar la lista de productos (y su categoría) desde la API ---
async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const { data } = await res.json();
  const catsRes = await fetch(`${API}/categories`);
  const { data: cats } = await catsRes.json();
  // Mapa: id de categoría -> nombre, para mostrar el nombre en vez del número
  const catMap = {};
  cats.forEach(c => catMap[c.id] = c.name);

  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';
  data.forEach(prod => {
    tbody.innerHTML += `
      <tr>
        <td>${prod.id}</td>
        <td>${prod.name}</td>
        <td>$${prod.price}</td>
        <td>${catMap[prod.categoryId] || 'Sin categoría'}</td>
        <td class="actions">
          <button class="edit" onclick="editProduct(${prod.id})">Editar</button>
          <button class="delete" onclick="deleteProduct(${prod.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

// --- Botón "Agregar / Actualizar" categoría ---
// Si hay una categoría en edición, hace PUT; si no, hace POST de una nueva.
document.getElementById('add-category').addEventListener('click', async () => {
  const input = document.getElementById('category-name');
  const name = input.value.trim();
  if (!name) return alert('Ingrese un nombre');

  if (editingCategoryId) {
    await fetch(`${API}/categories/${editingCategoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    // Termina la edición y el botón vuelve a decir "Agregar"
    editingCategoryId = null;
    document.getElementById('add-category').textContent = 'Agregar';
  } else {
    await fetch(`${API}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  }

  input.value = ''; // Limpia el campo
  loadCategories(); // Recarga la tabla
});

// Al apretar "Editar" en una categoría: la trae al campo de texto
function editCategory(id, name) {
  editingCategoryId = id;
  document.getElementById('category-name').value = name;
  document.getElementById('add-category').textContent = 'Actualizar';
}

// Borra una categoría (antes pregunta para no borrar por accidente)
async function deleteCategory(id) {
  if (!confirm('¿Eliminar categoría?')) return;
  const res = await fetch(`${API}/categories/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message); // Si el backend dijo no, lo avisamos
  loadCategories();
}

// Borra un producto (también confirma antes)
async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadProducts();
}

// Carga las tablas apenas abre la página
loadCategories();
loadProducts();