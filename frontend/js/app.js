const API = '';

let editingCategoryId = null;
let editingProductId = null;

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-section').classList.add('active');
    if (tab.dataset.tab === 'categories') loadCategories();
    if (tab.dataset.tab === 'products') loadProducts();
  });
});

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
          <button class="edit" onclick="editCategory(${cat.id}, '${cat.nombre.replace(/'/g, "\\'")}')">Editar</button>
          <button class="delete" onclick="deleteCategory(${cat.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

async function loadProducts() {
  const res = await fetch(`${API}/productos`);
  const { data } = await res.json();
  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';
  data.forEach(prod => {
    tbody.innerHTML += `
      <tr>
        <td>${prod.id}</td>
        <td>${prod.nombre}</td>
        <td>$${prod.precio}</td>
        <td>${prod.categoria_nombre || 'Sin categoría'}</td>
        <td>${prod.stock}</td>
        <td class="actions">
          <button class="edit" onclick="editProduct(${prod.id})">Editar</button>
          <button class="delete" onclick="deleteProduct(${prod.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}

document.getElementById('add-category').addEventListener('click', async () => {
  const input = document.getElementById('category-name');
  const nombre = input.value.trim();
  if (!nombre) return alert('Ingrese un nombre');

  if (editingCategoryId) {
    await fetch(`${API}/categorias/${editingCategoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    editingCategoryId = null;
    document.getElementById('add-category').textContent = 'Agregar';
  } else {
    await fetch(`${API}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
  }

  input.value = '';
  loadCategories();
});

function editCategory(id, nombre) {
  editingCategoryId = id;
  document.getElementById('category-name').value = nombre;
  document.getElementById('add-category').textContent = 'Actualizar';
}

async function deleteCategory(id) {
  if (!confirm('¿Eliminar categoría?')) return;
  const res = await fetch(`${API}/categorias/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadCategories();
}

document.getElementById('add-product').addEventListener('click', async () => {
  const nombre = document.getElementById('product-name').value.trim();
  const precio = parseFloat(document.getElementById('product-price').value);
  if (!nombre || !precio) return alert('Nombre y precio obligatorios');

  if (editingProductId) {
    await fetch(`${API}/productos/${editingProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    });
    editingProductId = null;
    document.getElementById('add-product').textContent = 'Agregar';
  } else {
    await fetch(`${API}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio, categoria_id: 1 })
    });
  }

  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  loadProducts();
});

function editProduct(id) {
  editingProductId = id;
  const row = document.querySelector(`#products-body tr:nth-child(${id})`);
  document.getElementById('product-name').value = 'Editando...';
  document.getElementById('add-product').textContent = 'Actualizar';
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  const res = await fetch(`${API}/productos/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadProducts();
}

loadCategories();
