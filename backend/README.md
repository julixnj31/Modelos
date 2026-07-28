# Backend - API de Gestión de Categorías y Productos

## 📁 Estructura

```
backend/
├── app.js                # Configuración de Express y rutas
├── config/
│   ├── db.js             # Conexión a MySQL
│   ├── database.sql      # Script de base de datos
│   └── .env.example      # Variables de entorno
├── controllers/          # Lógica de peticiones/respuestas
├── models/               # Acceso y manipulación de datos
├── routes/               # Definición de endpoints
└── data/                 # Datos en memoria (temporal)
```

## 🗄️ Base de Datos MySQL

La conexión está configurada en `config/db.js`. Ejecuta el script `config/database.sql` en MySQL para crear la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS inventario_adso;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY '#ADSO_node';
GRANT ALL PRIVILEGES ON inventario_adso.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🔌 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /categories | Listar todas las categorías |
| GET | /categories/:id | Obtener categoría por ID |
| POST | /categories | Crear una categoría |
| PUT | /categories/:id | Actualizar una categoría |
| DELETE | /categories/:id | Eliminar categoría (solo si no tiene productos) |
| GET | /categories/:id/products | Obtener productos de una categoría |
| GET | /products | Listar todos los productos |
| GET | /products/:id | Obtener producto por ID |
| POST | /products | Crear un producto |
| PUT | /products/:id | Actualizar un producto |
| DELETE | /products/:id | Eliminar un producto |
