-- ============================================================
-- database.sql - Estructura de la base de datos del inventario
-- Se ejecuta una sola vez en MySQL para crear las 8 tablas
-- y dejar datos de ejemplo para probar el sistema.
-- ============================================================

CREATE DATABASE IF NOT EXISTS inventario_adso;
USE inventario_adso;

-- TABLA usuarios
-- Quiénes entran al sistema: admin, vendedor o bodeguero.
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, -- NO puede repetirse entre usuarios
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin','vendedor','bodeguero') DEFAULT 'vendedor',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABLA categorias: clasificación de productos (ej: Computadoras, Periféricos).
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creado_por INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABLA proveedores: empresas a las que se les compra el inventario.
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    creado_por INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABLA clientes: personas que compran en el negocio.
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    documento VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    creado_por INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABLA productos: lo que se vende. Apunta a su categoría y proveedor.
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0, -- Cuántas unidades hay en bodega
    stock_minimo INT DEFAULT 5, -- Si baja de esto hay que reabastecer
    categoria_id INT NOT NULL,
    proveedor_id INT,
    creado_por INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT, -- No borra una categoría si tiene productos
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABLA ventas: cada vez que se vende algo se registra aquí.
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    usuario_id INT NOT NULL, -- Quién atendió la venta
    total DECIMAL(12,2) DEFAULT 0, -- Suman automático de los productos
    estado ENUM('completada','cancelada','pendiente') DEFAULT 'completada',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- TABLA detalle_ventas: los renglones de cada venta (qué vendió y cuánto).
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE, -- Si se borra la venta se borra su detalle
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- TABLA movimientos_inventario: historial de entradas/salidas/ajustes de stock.
CREATE TABLE movimientos_inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo ENUM('entrada','salida','ajuste') NOT NULL,
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    motivo TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ============================================================
--  DATOS DE PRUEBA (los borras cuando ya tengas datos reales)
-- ============================================================

-- Usuarios de ejemplo para iniciar sesión
-- Las contraseñas van ENCRIPTADAS (bcrypt). Las reales son:
--   admin123 para admin || vendedor123 para vendedor || bodega123 para bodeguero
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin', 'admin@inventario.com', '$2b$10$fywEUekQhLDz8xW0K6a1J.jG3SxXRbJbH5L39jRVkbDIsfhRj4nBS', 'admin'),
('Vendedor', 'vendedor@inventario.com', '$2b$10$DmAKhs7mroPo5/wn/798POP81r2iNYjgVPvNfCNWNZBMplNk6DJRq', 'vendedor'),
('Bodeguero', 'bodega@inventario.com', '$2b$10$ICCA6OeYFmi07JxVjOBOGOalwugnSN6HgQArmIB4zbuk4BpX112My', 'bodeguero');

-- Categorías de los productos
INSERT INTO categorias (nombre, creado_por) VALUES
('Computadoras y Laptops', 1),
('Periféricos y Accesorios', 1),
('Audio y Video', 1),
('Componentes de PC', 1),
('Mobiliario y Ergonomía', 1),
('Redes y Conectividad', 1),
('Dispositivos Inteligentes', 1);

-- Proveedores de ejemplo
INSERT INTO proveedores (nombre, contacto, telefono, email, creado_por) VALUES
('TecnoGlobal SAS', 'Carlos Pérez', '3001234567', 'carlos@tecnoglobal.com', 1),
('CompuParts Ltda', 'María García', '3107654321', 'maria@compuparts.com', 1),
('DistriRedes', 'Pedro López', '3209876543', 'pedro@distriredes.com', 1);

-- Clientes de ejemplo
INSERT INTO clientes (nombre, documento, telefono, email, creado_por) VALUES
('Juan Rodríguez', '1234567890', '3012345678', 'juan@gmail.com', 1),
('Ana Martínez', '9876543210', '3023456789', 'ana@outlook.com', 1),
('Carlos Gómez', '5678901234', '3034567890', 'carlos@yahoo.com', 1);

-- Productos de ejemplo con su categoría y proveedor
INSERT INTO productos (nombre, precio, stock, stock_minimo, categoria_id, proveedor_id, creado_por) VALUES
('Laptop Pro 15', 1200, 10, 3, 1, 1, 1),
('Mouse Inalámbrico', 25, 50, 10, 2, 2, 1),
('Teclado Mecánico RGB', 85, 30, 5, 2, 2, 1),
('Monitor 27 4K', 350, 15, 3, 2, 1, 1),
('Audífonos Noise Cancelling', 150, 20, 5, 3, 1, 1),
('Webcam Full HD', 60, 25, 5, 3, 2, 1),
('Impresora Multifuncional', 180, 8, 2, 2, 1, 1),
('Disco Duro Externo 2TB', 90, 40, 5, 4, 2, 1),
('Memoria RAM 16GB DDR4', 75, 35, 10, 4, 2, 1),
('Tarjeta de Video RTX 3060', 420, 5, 2, 4, 1, 1),
('Microscopio Digital USB', 45, 12, 3, 7, 3, 1),
('Silla Ergonómica Gamer', 210, 10, 2, 5, 3, 1),
('Escritorio Elevable', 300, 6, 1, 5, 3, 1),
('Router Wi-Fi 6', 110, 20, 5, 6, 3, 1),
('Tableta Gráfica', 130, 15, 3, 2, 2, 1),
('Smartphone de Pruebas', 250, 8, 2, 7, 1, 1),
('Smartwatch Deportivo', 95, 18, 5, 7, 1, 1),
('Cargador USB-C 65W', 35, 60, 15, 2, 2, 1),
('Hub USB-C 7 en 1', 50, 30, 10, 2, 2, 1),
('Parlante Bluetooth Portátil', 40, 22, 5, 3, 1, 1);