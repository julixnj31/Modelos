# Frontend - Interfaz Web de Gestión de Categorías y Productos

Frontend web desarrollado con **HTML, CSS y JavaScript vanilla** que consume la API REST de gestión de inventario.

## 🚀 Tecnologías

- HTML5
- CSS3
- JavaScript Vanilla (Fetch API)

## 📁 Estructura

```
├── index.html      # Página principal
├── css/
│   └── style.css   # Estilos
├── js/
│   └── app.js      # Lógica de consumo de API
└── README.md
```

## ▶️ Cómo usar

1. Asegúrate de que el **Backend** esté corriendo en `http://localhost:3000`
2. Abre `index.html` en tu navegador o usa Live Server

## 🔗 Endpoints que consume

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /categories | Listar categorías |
| POST | /categories | Crear categoría |
| PUT | /categories/:id | Actualizar categoría |
| DELETE | /categories/:id | Eliminar categoría |
| GET | /products | Listar productos |
| DELETE | /products/:id | Eliminar producto |
