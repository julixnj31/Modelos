# Modelos - Gestión de Categorías y Productos

Proyecto dividido en 3 módulos:

```
Modelos/
├── backend/          → API REST Node.js + Express + MySQL
│   ├── app.js
│   ├── package.json
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   │   ├── db.js
│   │   ├── database.sql
│   │   └── .env.example
│   ├── data/
│   └── public/
├── frontend/         → Interfaz web HTML/CSS/JS
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── docs/             → Documentación
│   ├── README.md
│   └── Documentacion.md
├── .gitignore
└── README.md
```

## Inicio rápido

```bash
cd backend
npm install
npm start
```

## Endpoints

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
