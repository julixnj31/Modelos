// ============================================================
// app.js (frontend) - La página que ve el usuario
// Se encarga de hablar con la API del backend y pintar
// los datos de categorías y productos en las tablas.
// ============================================================

// Dirección donde está corriendo el servidor de la API.
// Si el backend no está encendido en este puerto, nada de esto funciona.
const API = 'http://localhost:3000';

// Aquí se recuerda qué categoría se está editando mientras tanto.
// null significa "no estoy editando", y cualquier número significa
// "estoy actualizando la categoría con ese id".
let editingCategoryId = null;

// --- Pestañas (Categorías / Productos) ---
// Cuando el usuario hace clic en una pestaña, se le pone la clase "active"
// a esa pestaña y a su sección, y se la quita a las demás.
// Así solo se muestra una sección a la vez.
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-section').classList.add('active');
  });
});

// --- Cargar categorías ---
// Pide todas las categorías a la API y las va pintando fila por fila
// en la tabla. Cada fila lleva sus botones de Editar y Eliminar.
async function loadCategories() {
  const res = await fetch(`${API}/categorias`);
  const { data } = await res.json();
  const tbody = document.getElementById('categories-body');
  tbody.innerHTML = ''; // Limpia la tabla para no duplicar filas al recargar
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

// --- Cargar productos ---
// Primero pide los productos y también las categorías.
// Con las categorías hace un "mapa" (id -> nombre) que sirve para
// mostrar en la tabla el NOMBRE de la categoría y no el número.
async function loadProducts() {
  const res = await fetch(`${API}/productos`);
  const { data } = await res.json();
  const catsRes = await fetch(`${API}/categorias`);
  const { data: cats } = await catsRes.json();

  // Mapa: id de categoría -> nombre
  // Ej: si el producto dice categoria_id=2, aquí buscamos y sale "Periféricos"
  const catMap = {};
  cats.forEach(c => catMap[c.id] = c.nombre);

  const tbody = document.getElementById('products-body');
  tbody.innerHTML = ''; // Limpia la tabla antes de volver a pintar
  data.forEach(prod => {
    // Si el producto no tiene categoría, se muestra "Sin categoría"
    const categoria = catMap[prod.categoria_id] || 'Sin categoría';
    tbody.innerHTML += `
      <tr>
        <td>${prod.id}</td>
        <td>${prod.nombre}</td>
        <td>$${prod.precio}</td>
        <td>${categoria}</td>
        <td class="actions">
          <button class="edit" onclick="editProduct(${prod.id})">Editar</button>
          <button class="delete" onclick="deleteProduct(${prod.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

// --- Botón "Agregar / Actualizar" categoría ---
// Si hay una categoría en edición (editingCategoryId tiene valor), se hace
// un PUT (actualizar) sobre esa categoría. Si no, se hace un POST (nueva).
// Por eso el mismo botón dice "Agregar" o "Actualizar" según el momento.
document.getElementById('add-category').addEventListener('click', async () => {
  const input = document.getElementById('category-name');
  const name = input.value.trim();
  if (!name) return alert('Ingrese un nombre'); // No deja guardar vacío

  if (editingCategoryId) {
    // Estamos editando: le mandamos a la API el id y el nombre nuevo
    await fetch(`${API}/categorias/${editingCategoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name })
    });
    // Al terminar, se deja de editar y el botón vuelve a "Agregar"
    editingCategoryId = null;
    document.getElementById('add-category').textContent = 'Agregar';
  } else {
    // Estamos creando una categoría nueva: se la mandamos por POST
    await fetch(`${API}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name })
    });
  }

  input.value = ''; // Limpia el campo de texto
  loadCategories(); // Recarga la tabla para que se vea el cambio
});

// --- Botón "Editar" en la tabla de categorías ---
// Trae la categoría al campo de texto y cambia el botón a "Actualizar".
// La edición real se hace después al apretar ese botón (función de arriba).
function editCategory(id, name) {
  editingCategoryId = id; // Guarda cuál se va a actualizar
  document.getElementById('category-name').value = name;
  document.getElementById('add-category').textContent = 'Actualizar';
}

// --- Borrar categoría ---
// Pregunta antes (confirm) para que no se borre por accidente.
// Si el backend responde que no se puede (ej: tiene productos),
// mostramos su mensaje y no recargamos.
async function deleteCategory(id) {
  if (!confirm('¿Eliminar categoría?')) return;
  const res = await fetch(`${API}/categorias/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadCategories();
}

// --- Borrar producto ---
// Misma idea que categoría: confirma, borra y recarga.
async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  const res = await fetch(`${API}/productos/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadProducts();
}

// Al abrir la página se cargan las dos tablas de una vez
loadCategories();
loadProducts();