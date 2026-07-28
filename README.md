# Modelos - Gestión de Categorías y Productos

Proyecto completo dividido en 3 módulos:

## 📂 Estructura

```
Modelos/
├── backend/          → API REST con Node.js + Express
│   ├── project/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── data/
│   └── package.json
├── frontend/         → Interfaz web HTML/CSS/JS
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── docs/             → Documentación del proyecto
│   ├── README.md
│   └── profile/README.md
└── package.json
```

## 🚀 Inicio rápido

```bash
# Backend
cd backend
npm install
npm start

# Frontend (en otra terminal)
cd frontend
# Abrir index.html en el navegador
```

## 🔌 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /categories | Listar categorías |
| POST | /categories | Crear categoría |
| PUT | /categories/:id | Actualizar categoría |
| DELETE | /categories/:id | Eliminar (con validación) |
| GET | /products | Listar productos |
| POST | /products | Crear producto |
| PUT | /products/:id | Actualizar producto |
| DELETE | /products/:id | Eliminar producto |
| GET | /categories/:id/products | Productos por categoría |
