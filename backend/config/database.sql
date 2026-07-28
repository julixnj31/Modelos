-- ============================================
-- SCRIPT COMPLETO - Base de Datos inventario_adso
-- ============================================

CREATE DATABASE IF NOT EXISTS inventario_adso;
USE inventario_adso;

-- 1. USUARIOS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','vendedor','bodeguero') DEFAULT 'vendedor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CATEGORÍAS
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. PROVEEDORES
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. CLIENTES
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    document VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. PRODUCTOS
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    categoryId INT NOT NULL,
    supplierId INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. VENTAS
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT,
    userId INT NOT NULL,
    total DECIMAL(12,2) DEFAULT 0,
    status ENUM('completada','cancelada','pendiente') DEFAULT 'completada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT
);

-- 7. DETALLE DE VENTAS
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saleId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT
);

-- 8. MOVIMIENTOS DE INVENTARIO
CREATE TABLE inventory_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    userId INT NOT NULL,
    type ENUM('entrada','salida','ajuste') NOT NULL,
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT
);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Usuarios
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@inventario.com', 'admin123', 'admin'),
('Vendedor', 'vendedor@inventario.com', 'vendedor123', 'vendedor'),
('Bodeguero', 'bodega@inventario.com', 'bodega123', 'bodeguero');

-- Categorías
INSERT INTO categories (name, created_by) VALUES
('Computadoras y Laptops', 1),
('Periféricos y Accesorios', 1),
('Audio y Video', 1),
('Componentes de PC', 1),
('Mobiliario y Ergonomía', 1),
('Redes y Conectividad', 1),
('Dispositivos Inteligentes', 1);

-- Proveedores
INSERT INTO suppliers (name, contact, phone, email, created_by) VALUES
('TecnoGlobal SAS', 'Carlos Pérez', '3001234567', 'carlos@tecnoglobal.com', 1),
('CompuParts Ltda', 'María García', '3107654321', 'maria@compuparts.com', 1),
('DistriRedes', 'Pedro López', '3209876543', 'pedro@distriredes.com', 1);

-- Clientes
INSERT INTO clients (name, document, phone, email, created_by) VALUES
('Juan Rodríguez', '1234567890', '3012345678', 'juan@gmail.com', 1),
('Ana Martínez', '9876543210', '3023456789', 'ana@outlook.com', 1),
('Carlos Gómez', '5678901234', '3034567890', 'carlos@yahoo.com', 1);

-- Productos
INSERT INTO products (name, price, stock, min_stock, categoryId, supplierId, created_by) VALUES
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
