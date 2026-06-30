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
