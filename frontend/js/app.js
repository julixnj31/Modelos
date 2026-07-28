const API = 'http://localhost:3000';

let editingCategoryId = null;

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-section').classList.add('active');
  });
});

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

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const { data } = await res.json();
  const catsRes = await fetch(`${API}/categories`);
  const { data: cats } = await catsRes.json();
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
    editingCategoryId = null;
    document.getElementById('add-category').textContent = 'Agregar';
  } else {
    await fetch(`${API}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  }

  input.value = '';
  loadCategories();
});

function editCategory(id, name) {
  editingCategoryId = id;
  document.getElementById('category-name').value = name;
  document.getElementById('add-category').textContent = 'Actualizar';
}

async function deleteCategory(id) {
  if (!confirm('¿Eliminar categoría?')) return;
  const res = await fetch(`${API}/categories/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadCategories();
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!data.success) return alert(data.message);
  loadProducts();
}

loadCategories();
loadProducts();
