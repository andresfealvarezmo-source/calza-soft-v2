USE calza_soft_db;

INSERT INTO usuarios (nombre, correo, contrasena, rol, cargo, turno, direccion) VALUES
('Admin General', 'admin@calzasoft.com', 'admin123', 'Administrador', 'Gerente TI', NULL, NULL),
('Carlos Vendedor', 'vendedor@calzasoft.com', 'vendedor123', 'Vendedor', NULL, 'Mañana', NULL),
('Maria Cliente', 'cliente@calzasoft.com', 'cliente123', 'Cliente', NULL, NULL, 'Calle 100 # 15-20, Bogotá');

INSERT INTO referencias (nombreRef, descripcion, fechaIngreso) VALUES
('REF-BOOT-01', 'Bota de cuero sintético resistente al agua', '2026-01-15'),
('REF-SNK-02', 'Tenis deportivos urbanos ultraligeros', '2026-02-10'),
('REF-FOR-03', 'Zapato formal ejecutivo de cuero', '2026-03-01');

INSERT INTO productos (referencia, nombre, imagen, talla, precioMenor, precioMayor, estado, idReferencia) VALUES
('REF-BOOT-01', 'Bota Trekking Pro', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', '39', 120000.00, 95000.00, 'Disponible', 1),
('REF-BOOT-01', 'Bota Trekking Pro', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', '40', 120000.00, 95000.00, 'Disponible', 1),
('REF-SNK-02', 'Tenis Urban Flex', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', '38', 90000.00, 75000.00, 'Disponible', 2),
('REF-SNK-02', 'Tenis Urban Flex', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300', '41', 90000.00, 75000.00, 'Agotado', 2),
('REF-FOR-03', 'Zapato Elegance Classic', 'https://images.unsplash.com/photo-1533867617858-e7d97e06085a?w=300', '42', 150000.00, 130000.00, 'Disponible', 3);

INSERT INTO inventario (idProducto, cantidad) VALUES
(1, 15),
(2, 8),
(3, 20),
(4, 0),
(5, 12);

INSERT INTO puntos_venta (nombre, direccion, ubicacion) VALUES
('Calza Soft Centro', 'Carrera 7 # 12-32, Bogotá', 'Norte-Centro'),
('Calza Soft San Cristóbal', 'Calle 11 Sur # 3-45, Bogotá', 'Sur'),
('Calza Soft Salitre Plaza', 'Transversal 68 # 40-39, Bogotá', 'Occidente');
