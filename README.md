# Reflexión y Análisis – Arquitectura MVC en Node.js

## Introducción

Durante el desarrollo de esta guía se trabajó con la arquitectura **MVC (Modelo – Vista – Controlador)** utilizando **Node.js** y **Express.js**. El propósito fue comprender cómo se organiza un proyecto backend de forma profesional, separando las responsabilidades entre rutas, controladores y modelos para facilitar el mantenimiento y crecimiento de la aplicación.

---

# Actividad 1

## 1. ¿Qué problemas podrían aparecer si toda la lógica del sistema se mantiene directamente dentro de las rutas?

Si toda la lógica se desarrolla dentro de las rutas, el código se vuelve desordenado y difícil de mantener. Además, aumenta la duplicación de funciones, es más complicado encontrar errores y resulta difícil agregar nuevas funcionalidades cuando el proyecto crece.

---

## 2. ¿Cómo podría afectar esto el trabajo cuando varias personas desarrollan el mismo proyecto?

Cuando varias personas trabajan sobre un mismo archivo con toda la lógica mezclada, es más probable que ocurran conflictos al integrar cambios. También se dificulta comprender el código de otros desarrolladores y disminuye la productividad del equipo.

---

## 3. ¿Por qué crees que en proyectos grandes se busca separar responsabilidades dentro del código?

Porque permite organizar mejor el proyecto, hacer el código más limpio y facilitar el mantenimiento. Cada componente cumple una función específica, lo que ayuda a desarrollar nuevas funcionalidades sin afectar el resto del sistema.

---

## 4. ¿Qué ventajas podría tener dividir el backend en componentes especializados como rutas, controladores y modelos?

Las principales ventajas son:

* Mejor organización del proyecto.
* Código más limpio y fácil de entender.
* Mayor reutilización de funciones.
* Facilita el trabajo colaborativo.
* Simplifica el mantenimiento.
* Permite escalar la aplicación con mayor facilidad.
* Hace más sencilla la integración con bases de datos y el frontend.

---

# Actividad 2

## ¿Qué componente se encarga de recibir la petición HTTP y dirigirla al controlador?

Las **rutas (Routes)** son las encargadas de recibir la petición HTTP y enviarla al controlador correspondiente según el endpoint solicitado.

---

## ¿Qué componente se encarga de comunicarse con la base de datos?

El **modelo (Model)** es el componente encargado de gestionar los datos y comunicarse con la base de datos o con la fuente de información utilizada por la aplicación.

---

## ¿Qué componente envía finalmente la respuesta HTTP al cliente?

El **controlador (Controller)** procesa la información recibida del modelo y construye la respuesta HTTP que será enviada al cliente.

---

# Conclusión

La arquitectura **MVC** permite desarrollar aplicaciones backend más organizadas, mantenibles y escalables. Al separar las responsabilidades entre rutas, controladores y modelos, el código es más fácil de comprender, reutilizar y mantener. Esta estructura también facilita el trabajo en equipo y prepara la aplicación para futuras integraciones con bases de datos, autenticación y aplicaciones frontend.

# Sistema de Gestion de Tareas y Usuarios con Node.js, Express y MVC

Este proyecto evoluciono desde un CRUD basico de PQRS hacia un sistema de **gestion de tareas con usuarios**, con autenticacion JWT, roles (Admin/Usuario), asignacion de tareas a multiples usuarios, filtros, dashboard y un frontend estatico.

No usa una base de datos real. Los datos se guardan temporalmente en arreglos dentro de los modelos (se pierden al reiniciar el servidor).

## Estructura del proyecto

```txt
Modelos/
|
+-- app.js
+-- package.json
+-- package-lock.json
|
+-- middleware/
|   +-- authMiddleware.js
|
+-- controllers/
|   +-- authController.js
|   +-- userController.js
|   +-- taskController.js
|   +-- dashboardController.js
|
+-- models/
|   +-- userModel.js
|   +-- taskModel.js
|
+-- routes/
|   +-- authRoutes.js
|   +-- userRoutes.js
|   +-- taskRoutes.js
|   +-- dashboardRoutes.js
|
+-- public/
    +-- index.html      (login)
    +-- admin.html      (panel administrador)
    +-- user.html        (panel de usuario)
    +-- css/style.css
    +-- js/api.js, login.js, admin.js, user.js
```

## Como funciona el MVC

```txt
Cliente HTTP -> Ruta -> Middleware de auth -> Controlador -> Modelo -> Controlador -> Cliente HTTP
```

1. El cliente hace una peticion con su token JWT, por ejemplo `GET /api/tasks`.
2. La ruta valida el token y el rol (`middleware/authMiddleware.js`).
3. La ruta llama al controlador.
4. El controlador llama al modelo.
5. El modelo trabaja con los datos en memoria y devuelve el resultado.
6. El controlador responde al cliente con JSON.

## Instalacion

```bash
npm install
```

Si PowerShell da error con `npm`, usa `npm.cmd install`.

## Ejecutar el proyecto

```bash
npm run dev
```

El servidor intenta el puerto `3000` y si esta ocupado prueba con el siguiente (`3001`, `3002`, ...).

Abre `http://localhost:3000` en el navegador para ver el login del frontend.

## Usuarios de prueba (seed)

| Rol | Email | Password |
|---|---|---|
| Admin | admin@demo.com | admin123 |
| Usuario | juan@demo.com | juan123 |
| Usuario | maria@demo.com | maria123 |

## Rutas de la API

Todas las rutas (excepto `/api/auth/login` y `/api/health`) requieren el header `Authorization: Bearer <token>` obtenido en el login.

### Auth

```txt
POST /api/auth/login
```

Cuerpo JSON: `{ "email": "...", "password": "..." }`. Responde `{ token, user }`.

### Usuarios (solo Admin, salvo lo indicado)

```txt
POST   /api/users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/status         body: { "status": "active" | "inactive" }
GET    /api/users/:userId/tasks      (Admin o el propio usuario)
```

### Tareas

```txt
POST   /api/tasks                              (Admin)
GET    /api/tasks                              (Admin)
GET    /api/tasks/filter?status=&priority=&userId=   (Admin)
GET    /api/tasks/:id                          (Admin o usuario asignado)
PUT    /api/tasks/:id                          (Admin)
DELETE /api/tasks/:id                          (Admin)
PATCH  /api/tasks/:id/status                   (Admin o usuario asignado) body: { "status": "pendiente" | "en_progreso" | "completada" }
POST   /api/tasks/:taskId/assign               (Admin) body: { "userIds": [1, 2] }
GET    /api/tasks/:taskId/users                (Admin)
DELETE /api/tasks/:taskId/users/:userId        (Admin)
```

### Dashboard

```txt
GET /api/dashboard   (Admin) -> totales de usuarios/tareas, conteo por status/prioridad, tareas por usuario
```

## Frontend

- `index.html`: login, guarda el token en `localStorage` y redirige segun el rol.
- `admin.html`: dashboard con estadisticas, administracion de usuarios (crear/editar/eliminar/activar-desactivar) y administracion de tareas (crear con seleccion multiple de usuarios via checkboxes, filtros por status/prioridad/usuario, cambiar estado, quitar un usuario asignado, eliminar tarea).
- `user.html`: lista de tareas asignadas al usuario logueado, con boton para marcarlas como completadas.

## Datos importantes

- Los datos se pierden cuando se apaga el servidor (todo en memoria).
- Las contrasenas se guardan hasheadas con `bcryptjs`.
- La autenticacion usa JWT (`jsonwebtoken`), valido por 8 horas.
- El modelo solo maneja datos, el controlador responde al cliente, las rutas no tienen logica de negocio.

## Comandos utiles

```bash
npm install     # instalar dependencias
npm run dev     # ejecutar en modo desarrollo
npm start       # ejecutar normal
```

Detener el servidor: `Ctrl + C`
