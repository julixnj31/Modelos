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

# Sistema PQRS con Node.js, Express y MVC

Este proyecto es un sistema basico de PQRS: Peticiones, Quejas, Reclamos y Sugerencias.

La idea es practicar la arquitectura MVC usando Node.js y Express. No usa una base de datos real. Los datos se guardan temporalmente en un arreglo dentro del modelo.

## Estructura del proyecto

```txt
Modelos/
|
+-- app.js
+-- package.json
+-- package-lock.json
|
+-- controllers/
|   +-- pqrsController.js
|
+-- models/
|   +-- pqrsModel.js
|
+-- routes/
    +-- pqrsRoutes.js
```

## Como funciona el MVC

El flujo del proyecto es este:

```txt
Cliente HTTP -> Ruta -> Controlador -> Modelo -> Controlador -> Cliente HTTP
```

Explicado mas sencillo:

1. El cliente hace una peticion, por ejemplo `GET /api/pqrs`.
2. La ruta recibe esa peticion.
3. La ruta llama al controlador.
4. El controlador llama al modelo.
5. El modelo trabaja con los datos y devuelve el resultado.
6. El controlador responde al cliente con JSON.

## Que hace cada archivo

### `app.js`

Es el archivo principal.

Aqui se configura Express, se activa el uso de JSON y se conectan las rutas de PQRS.

Tambien levanta el servidor. Primero intenta usar el puerto `3000`. Si ese puerto esta ocupado, prueba con `3001`, luego `3002`, y asi.

### `routes/pqrsRoutes.js`

Este archivo contiene las rutas.

No tiene logica de negocio. Solo dice que controlador se ejecuta segun el metodo HTTP:

```txt
GET    /api/pqrs
GET    /api/pqrs/:id
POST   /api/pqrs
PUT    /api/pqrs/:id
DELETE /api/pqrs/:id
```

### `controllers/pqrsController.js`

Este archivo recibe las peticiones y responde al cliente.

Cada metodo usa `async/await` y tiene `try/catch` para manejar errores.

El controlador es el unico que usa `res.status(...).json(...)`.

### `models/pqrsModel.js`

Este archivo simula la base de datos usando un arreglo.

Aqui estan las funciones para:

- Obtener todas las PQRS.
- Obtener una PQRS por ID.
- Crear una PQRS.
- Actualizar una PQRS.
- Eliminar una PQRS.

Importante: el modelo no responde al cliente. Solo devuelve datos al controlador.

## Instalacion

Primero instala las dependencias:

```bash
npm install
```

Si estas usando PowerShell y te sale un error con `npm`, puedes usar:

```bash
npm.cmd install
```

## Ejecutar el proyecto

Para levantar el servidor usa:

```bash
npm run dev
```

Si PowerShell bloquea el comando, usa:

```bash
npm.cmd run dev
```

Cuando el servidor inicie, veras algo parecido a esto:

```txt
Servidor corriendo en http://localhost:3000
```

Si el puerto `3000` esta ocupado, puede salir algo asi:

```txt
El puerto 3000 esta ocupado. Probando con 3001...
Servidor corriendo en http://localhost:3001
```

En ese caso debes usar el puerto que salga en la consola.

## Rutas disponibles

### Probar si el servidor funciona

```txt
GET /
```

Respuesta esperada:

```json
{
  "message": "Sistema PQRS funcionando"
}
```

### Obtener todas las PQRS

```txt
GET /api/pqrs
```

Ejemplo:

```bash
http://localhost:3000/api/pqrs
```

### Obtener una PQRS por ID

```txt
GET /api/pqrs/1
```

### Crear una PQRS

```txt
POST /api/pqrs
```

Cuerpo JSON:

```json
{
  "tipo": "Sugerencia",
  "descripcion": "Seria bueno tener atencion por chat.",
  "estado": "Pendiente"
}
```

### Actualizar una PQRS

```txt
PUT /api/pqrs/1
```

Cuerpo JSON:

```json
{
  "estado": "Resuelta"
}
```

### Eliminar una PQRS

```txt
DELETE /api/pqrs/1
```

## Probar desde Thunder Client o Postman

Puedes probar el proyecto usando Thunder Client en VS Code o Postman.

Ejemplo para crear una PQRS:

1. Selecciona el metodo `POST`.
2. Usa esta URL:

```txt
http://localhost:3000/api/pqrs
```

3. En el body selecciona `JSON`.
4. Escribe:

```json
{
  "tipo": "Queja",
  "descripcion": "La atencion fue demorada.",
  "estado": "Pendiente"
}
```

5. Envia la peticion.

Recuerda cambiar `3000` por `3001` u otro puerto si la consola te dice que el servidor inicio en otro puerto.

## Datos importantes

- Los datos se pierden cuando se apaga el servidor.
- No se usa base de datos real.
- El modelo solo maneja datos.
- El controlador responde al cliente.
- Las rutas no tienen logica de negocio.

## Comandos utiles

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Ejecutar normal:

```bash
npm start
```

Detener el servidor:

```txt
Ctrl + C
```
