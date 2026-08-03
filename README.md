# Modelos - Gestión de Inventario

Sistema completo de inventario con **frontend** (página web) y **backend** (API REST
Node.js + Express + MySQL). Maneja categorías, productos, usuarios, proveedores,
clientes, ventas e inventario.

```
Modelos/
├── backend/          → API de Node.js + Express + MySQL
│   ├── app.js
│   ├── config/
│   │   ├── db.js          → conexión a la base (lee el .env)
│   │   ├── database.sql   → crea las 8 tablas y datos de prueba
│   │   └── .env.example   → plantilla de credenciales
│   ├── controllers/       → lógica de cada módulo
│   ├── models/            → consultas SQL
│   ├── routes/            → URLs de la API
│   └── data/              → datos de ejemplo (solo referencia)
├── frontend/         # Interfaz web (HTML/CSS/JS)
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── docs/             # Documentación del proyecto
├── .gitignore
└── README.md
```

## Requisitos

- Node.js (versión 18 o superior)
- MySQL (por ejemplo XAMPP o WAMP, con el servicio de MySQL encendido)

## Cómo ponerlo a andar (paso a paso)

1. **Crear la base de datos** — Abre MySQL (ej. en phpMyAdmin) y ejecuta
   el archivo `backend/config/database.sql`. Esto crea la BD `inventario_adso`
   con sus 8 tablas y datos de prueba.

   Si la BD ya la creaste antes de que existiera el encriptado, corre el
   script que deja las contraseñas de los usuarios de prueba en bcrypt:

   ```bash
   cd backend
   npm run seed
   ```

2. **Crear tus credenciales** — Dentro de `backend/`, copia el archivo
   `.env.example` como `.env` y pon tu usuario y contraseña de MySQL:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edita el `.env` con tus datos (usuario, contraseña, nombre de BD).

   > El `.env` NO se sube a Git (está en `.gitignore`), así cada quien
   > usa sus propias credenciales.

3. **Instalar dependencias y encender la API:**

   ```bash
   cd backend
   npm install
   npm start
   ```

   Verás `Servidor encendido en el puerto 3000`. La API queda escuchando ahí.

4. **Abrir la página:** doble clic en `frontend/index.html` (o servirlo con
   VS Code / Live Server). La página pide iniciar sesión y se conecta a
   `http://localhost:3000`.

## Iniciar sesión

Usuarios de prueba (contraseñas en bcrypt):
`admin@inventario.com / admin123` · `vendedor@inventario.com / vendedor123` · `bodega@inventario.com / bodega123`

Todas las rutas de la API (menos `/login`) exigen un **token**. Lo consigues
haciendo `POST /login` con email y contraseña; luego se envía en la cabecera
`Authorization: Bearer <token>`.

## Endpoints de la API

Todas las rutas responden JSON: `{ success, message, data, errors }`.

| Método | Ruta                      | Descripción                          |
|--------|---------------------------|--------------------------------------|
| POST   | /login                    | Iniciar sesión (entrega token)       |
| GET    | /categorias               | Listar categorías                    |
| POST   | /categorias               | Crear categoría                      |
| PUT    | /categorias/:id           | Actualizar categoría                 |
| DELETE | /categorias/:id           | Eliminar (solo si está vacía)        |
| GET    | /categorias/:id/products  | Productos de una categoría           |
| GET    | /productos                | Listar productos                     |
| POST   | /productos                | Crear producto                       |
| PUT    | /productos/:id            | Actualizar producto                  |
| DELETE | /productos/:id            | Eliminar producto                    |
| GET    | /usuarios                 | Lista de usuarios                    |
| POST   | /usuarios                 | Crear usuario                        |
| PUT    | /usuarios/:id             | Actualizar usuario                   |
| DELETE | /usuarios/:id             | Eliminar usuario                     |
| GET    | /proveedores              | Lista de proveedores                 |
| POST   | /proveedores              | Crear proveedor                      |
| DELETE | /proveedores/:id          | Eliminar proveedor                   |
| GET    | /clientes                 | Lista de clientes                    |
| POST   | /clientes                 | Crear cliente                        |
| DELETE | /clientes/:id             | Eliminar cliente                     |
| GET    | /ventas                   | Lista de ventas                      |
| POST   | /ventas                   | Crear venta (descuenta stock)        |
| DELETE | /ventas/:id               | Eliminar venta                       |
| GET    | /inventario               | Historial de movimientos             |
| POST   | /inventario               | Registrar entrada/salida/ajuste      |

## Página web

La página tiene una pestaña por módulo: Categorías, Productos, Usuarios,
Proveedores, Clientes, Ventas e Inventario. Cada una muestra su tabla y su
formulario para agregar registros; en Categorías y Productos además se puede
editar.