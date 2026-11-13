
USE defaultdb;

-- ============================================
-- CALZA SOFT V2 - BASE DE DATOS
-- Compatible con MySQL de Aiven
-- ============================================

-- 1. USUARIOS
-- Administradores, vendedores y clientes
CREATE TABLE IF NOT EXISTS usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NULL UNIQUE,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Vendedor', 'Cliente') NOT NULL,
    cargo VARCHAR(50) NULL,
    turno VARCHAR(50) NULL,
    direccion VARCHAR(150) NULL
) ENGINE=InnoDB;

-- 2. REFERENCIAS
CREATE TABLE IF NOT EXISTS referencias (
    idReferencia INT AUTO_INCREMENT PRIMARY KEY,
    nombreRef VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    fechaIngreso DATE NOT NULL
) ENGINE=InnoDB;

-- 3. PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
    idProducto INT AUTO_INCREMENT PRIMARY KEY,
    referencia VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) NULL,
    talla VARCHAR(10) NOT NULL,
    precioMenor DECIMAL(10,2) NOT NULL,
    precioMayor DECIMAL(10,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Disponible',
    idReferencia INT NULL,
    CONSTRAINT fk_producto_referencia
        FOREIGN KEY (idReferencia)
        REFERENCES referencias(idReferencia)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. INVENTARIO
CREATE TABLE IF NOT EXISTS inventario (
    idInventario INT AUTO_INCREMENT PRIMARY KEY,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad >= 0),
    fechaActualizacion TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventario_producto
        FOREIGN KEY (idProducto)
        REFERENCES productos(idProducto)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. PUNTOS DE VENTA
CREATE TABLE IF NOT EXISTS puntos_venta (
    idPuntoVenta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 6. VENTAS
CREATE TABLE IF NOT EXISTS ventas (
    idVenta INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    idUsuario INT NOT NULL,
    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES usuarios(idUsuario)
) ENGINE=InnoDB;

-- 7. DETALLE DE VENTAS
CREATE TABLE IF NOT EXISTS detalle_venta (
    idDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idVenta INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (idVenta)
        REFERENCES ventas(idVenta)
        ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (idProducto)
        REFERENCES productos(idProducto)
) ENGINE=InnoDB;
