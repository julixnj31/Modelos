# Documentación del Proyecto - Gestión de Categorías y Productos

## 📋 Tabla de Contenido

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Arquitectura](#-arquitectura)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Repositorios](#-repositorios)
5. [Backend - API REST](#-backend---api-rest)
6. [Frontend - Interfaz Web](#-frontend---interfaz-web)
7. [Endpoints de la API](#-endpoints-de-la-api)
8. [Reglas de Negocio](#-reglas-de-negocio)
9. [Guía de Instalación](#-guía-de-instalación)
10. [Pruebas en Postman](#-pruebas-en-postman)

---

## 📌 Descripción del Proyecto

Sistema de gestión de inventario que permite administrar **categorías** y **productos** aplicando **arquitectura en capas** en el backend y una interfaz web frontend que consume la API REST.

### Funcionalidades principales:

- CRUD completo de categorías
- CRUD completo de productos
- Relación entre productos y categorías (FK lógica)
- Regla de integridad: No permite eliminar categorías con productos vinculados
- Respuestas JSON estandarizadas

---

## 🏗 Arquitectura

### Arquitectura en Capas (Backend)

```
Cliente (Postman / Frontend)
        ↓
   ┌──────────┐
   │  Routes   │  → Define las rutas/endpoints
   ├──────────┤
   │Controllers│  → Maneja peticiones y respuestas HTTP
   ├──────────┤
   │  Models   │  → Lógica de acceso y manipulación de datos
   ├──────────┤
   │   Data    │  → Fuente de datos (arreglos en memoria)
   └──────────┘
```

### Flujo de la información:

1. El cliente hace una petición HTTP a un endpoint
2. **Routes** recibe la petición y la dirige al controlador correspondiente
3. **Controller** procesa la lógica, valida datos y llama al modelo
4. **Model** ejecuta la operación sobre los datos (CRUD)
5. **Controller** formatea la respuesta JSON estandarizada
6. Se envía la respuesta al cliente

---

## 💻 Tecnologías Utilizadas

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 20+ | Entorno de ejecución |
| Express | 5.2.1 | Framework web |
| Nodemon | 3.1.0 | Recarga automática en desarrollo |

### Frontend
| Tecnología | Propósito |
|------------|-----------|
| HTML5 | Estructura de la interfaz |
| CSS3 | Estilos visuales |
| JavaScript Vanilla | Consumo de API y lógica del cliente |

### Herramientas
| Herramienta | Propósito |
|-------------|-----------|
| Postman | Pruebas de endpoints |
| Git / GitHub | Control de versiones |
| Visual Studio Code | Editor de código |

---

## 📂 Repositorios

### [Backend](https://github.com/Grupo-5-Programacion-Software/Backend)
API REST con Express siguiendo arquitectura en capas.

```
project/
├── app.js                     # Configuración de Express y rutas
├── controllers/               # Lógica de peticiones/respuestas
│   ├── category.controller.js
│   └── product.controller.js
├── models/                    # Acceso y manipulación de datos
│   ├── category.model.js
│   └── product.model.js
├── routes/                    # Definición de endpoints
│   ├── category.routes.js
│   └── product.routes.js
└── data/                      # Datos en memoria
    ├── categories.data.js
    └── products.data.js
```

### [Frontend](https://github.com/Grupo-5-Programacion-Software/Frontend)
Interfaz web que consume la API.

```
├── index.html       # Página principal
├── css/
│   └── style.css    # Estilos
├── js/
│   └── app.js       # Lógica de consumo de API
└── README.md
```

### [Documentación](https://github.com/Grupo-5-Programacion-Software/.github)
Documentación general del proyecto.

```
├── profile/
│   └── README.md    # Perfil de la organización
├── docs/
│   └── ...          # Documentación adicional
└── README.md        # Este archivo
```

---

## 🚀 Backend - API REST

### Instalación

```bash
git clone https://github.com/Grupo-5-Programacion-Software/Backend.git
cd Backend
npm install
npm start
```

El servidor se ejecutará en `http://localhost:3000`

### Estructura de Capas

| Capa | Archivo | Responsabilidad |
|------|---------|----------------|
| **Data** | `data/categories.data.js` | Almacenamiento inicial de datos |
| **Data** | `data/products.data.js` | Almacenamiento inicial de datos |
| **Model** | `models/category.model.js` | CRUD de categorías |
| **Model** | `models/product.model.js` | CRUD de productos + findByCategoryId |
| **Controller** | `controllers/category.controller.js` | Manejo de peticiones de categorías |
| **Controller** | `controllers/product.controller.js` | Manejo de peticiones de productos |
| **Routes** | `routes/category.routes.js` | Endpoints de categorías |
| **Routes** | `routes/product.routes.js` | Endpoints de productos |
| **App** | `app.js` | Configuración y montaje de rutas |

---

## 🌐 Frontend - Interfaz Web

### Cómo usar

1. Asegúrate de que el Backend esté corriendo en `http://localhost:3000`
2. Abre `index.html` directamente en el navegador o con Live Server
3. Navega entre las pestañas **Categorías** y **Productos**

### Funcionalidades

- Listar categorías y productos
- Crear categorías con nombre
- Editar nombre de categoría
- Eliminar categorías (con validación de integridad)
- Eliminar productos

---

## 🔌 Endpoints de la API

### Categorías

| Método | Ruta | Código | Descripción |
|--------|------|--------|-------------|
| `GET` | `/categories` | `200` | Lista todas las categorías |
| `GET` | `/categories/:id` | `200` / `404` | Busca categoría por ID |
| `POST` | `/categories` | `201` / `400` | Crea una categoría |
| `PUT` | `/categories/:id` | `200` / `404` | Actualiza una categoría |
| `DELETE` | `/categories/:id` | `200` / `404` / `409` | Elimina (validando integridad) |
| `GET` | `/categories/:id/products` | `200` / `404` | Productos de una categoría |

### Productos

| Método | Ruta | Código | Descripción |
|--------|------|--------|-------------|
| `GET` | `/products` | `200` | Lista todos los productos |
| `GET` | `/products/:id` | `200` / `404` | Busca producto por ID |
| `POST` | `/products` | `201` / `400` | Crea un producto |
| `PUT` | `/products/:id` | `200` / `404` | Actualiza un producto |
| `DELETE` | `/products/:id` | `200` / `404` | Elimina un producto |

### Formato de Respuesta Estandarizado

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [],
  "errors": []
}
```

---

## ⚖️ Reglas de Negocio

### Integridad Referencial (Categoría - Producto)

**Regla:** No se permite eliminar una categoría si tiene productos vinculados.

**Comportamiento:**
1. Se verifica si la categoría existe (si no, devuelve `404`)
2. Se consulta al modelo de productos si hay algún producto con ese `categoryId`
3. Si hay productos vinculados → `409 Conflict` con mensaje: *"No se puede eliminar la categoría porque tiene al menos un recurso vinculado"*
4. Si no hay productos vinculados → se elimina y devuelve `200 OK`

**Implementación:**
- `category.controller.js` llama a `ProductModel.findByCategoryId(id)`
- Si `linkedProducts.length > 0` → rechaza con `409`
- Los productos existentes tienen `categoryId` que referencia a las categorías 1-7

---

## 📖 Guía de Instalación

### Requisitos

- Node.js v18 o superior
- npm
- Navegador web moderno

### Paso a paso

```bash
# 1. Clonar el backend
git clone https://github.com/Grupo-5-Programacion-Software/Backend.git
cd Backend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start

# 4. En otra terminal, clonar el frontend
git clone https://github.com/Grupo-5-Programacion-Software/Frontend.git
cd Frontend

# 5. Abrir index.html en el navegador
```

---

## 🧪 Pruebas en Postman

### Colección de pruebas

| # | Prueba | Método | URL | Body | Resultado Esperado |
|---|--------|--------|-----|------|--------------------|
| 1 | Listar categorías | `GET` | `/categories` | — | `200` - Lista de 7 categorías |
| 2 | Buscar categoría ID 1 | `GET` | `/categories/1` | — | `200` - Computadoras y Laptops |
| 3 | Crear categoría | `POST` | `/categories` | `{ "name": "Laptops" }` | `201` - Creada con ID 8 |
| 4 | Actualizar categoría | `PUT` | `/categories/8` | `{ "name": "Laptops Pro" }` | `200` - Nombre actualizado |
| 5 | Eliminar categoría sin productos | `DELETE` | `/categories/8` | — | `200` - Eliminada correctamente |
| 6 | Eliminar categoría CON productos | `DELETE` | `/categories/1` | — | `409` - Conflict (tiene productos) |
| 7 | Productos de categoría 1 | `GET` | `/categories/1/products` | — | `200` - Laptop Pro 15 |

### Configuración de Postman

1. Método: seleccionar de la lista desplegable
2. URL: `http://localhost:3000` + ruta del endpoint
3. Body → raw → JSON (para POST y PUT)
4. Header: `Content-Type: application/json`

---

## ✅ Checklist de Entrega

| Tarea | Estado |
|-------|--------|
| CRUD de Categorías funcionando al 100% | ✅ |
| Los productos incluyen la propiedad `categoryId` | ✅ |
| Las respuestas JSON siguen el formato estandarizado | ✅ |
| Se impide el borrado de categorías con productos vinculados | ✅ |
| Código organizado en arquitectura de 4 capas | ✅ |
| Frontend web funcional | ✅ |
| Documentación completa | ✅ |
