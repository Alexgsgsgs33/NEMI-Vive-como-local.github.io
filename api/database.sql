-- NEMI Database Schema
-- Versión: 1.0.0
-- Autor: Equipo NEMI

-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE IF NOT EXISTS nemi_db;
USE nemi_db;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    tipo ENUM('admin', 'proveedor', 'usuario') DEFAULT 'usuario',
    status ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'pendiente',
    avatar VARCHAR(255),
    ultimo_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_tipo (tipo),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: proveedores
-- ============================================
CREATE TABLE IF NOT EXISTS proveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre_negocio VARCHAR(200) NOT NULL,
    tipo_negocio ENUM('hotel', 'restaurant', 'tour', 'transportation', 'shop', 'other') NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    sitio_web VARCHAR(255),
    servicios JSON,
    capacidad INT,
    precio_rango ENUM('$', '$$', '$$$', '$$$$') DEFAULT '$$',
    plan ENUM('basico', 'premium', 'empresarial') DEFAULT 'basico',
    verificacion ENUM('pendiente', 'verificado', 'rechazado') DEFAULT 'pendiente',
    rating DECIMAL(3,2) DEFAULT 0,
    total_resenas INT DEFAULT 0,
    fotos JSON,
    horario JSON,
    politicas JSON,
    status ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_tipo_negocio (tipo_negocio),
    INDEX idx_verificacion (verificacion),
    INDEX idx_rating (rating),
    FULLTEXT idx_busqueda (nombre_negocio, descripcion, servicios)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: hoteles
-- ============================================
CREATE TABLE IF NOT EXISTS hoteles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    estrellas INT DEFAULT 3 CHECK (estrellas BETWEEN 1 AND 5),
    precio_noche DECIMAL(10,2) NOT NULL,
    amenidades JSON,
    habitaciones JSON,
    fotos JSON,
    rating DECIMAL(3,2) DEFAULT 0,
    total_resenas INT DEFAULT 0,
    status ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_estrellas (estrellas),
    INDEX idx_precio (precio_noche),
    INDEX idx_rating (rating),
    FULLTEXT idx_busqueda (nombre, descripcion, amenidades)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: tours
-- ============================================
CREATE TABLE IF NOT EXISTS tours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(100) NOT NULL,
    duracion_horas DECIMAL(4,2) NOT NULL,
    precio_persona DECIMAL(10,2) NOT NULL,
    max_personas INT DEFAULT 10,
    incluye JSON,
    no_incluye JSON,
    recomendaciones JSON,
    fotos JSON,
    rating DECIMAL(3,2) DEFAULT 0,
    total_resenas INT DEFAULT 0,
    status ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_precio (precio_persona),
    INDEX idx_duracion (duracion_horas),
    INDEX idx_rating (rating),
    FULLTEXT idx_busqueda (nombre, descripcion, incluye)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: eventos
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    precio DECIMAL(10,2),
    tipo ENUM('cultural', 'religioso', 'feria', 'festival', 'deportivo', 'musical') NOT NULL,
    capacidad INT,
    actividades JSON,
    fotos JSON,
    status ENUM('activo', 'cancelado', 'completo', 'pendiente') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_tipo (tipo),
    INDEX idx_fecha_inicio (fecha_inicio),
    INDEX idx_status (status),
    FULLTEXT idx_busqueda (nombre, descripcion, actividades)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: restaurantes
-- ============================================
CREATE TABLE IF NOT EXISTS restaurantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    tipo_cocina VARCHAR(100),
    precio_rango ENUM('$', '$$', '$$$', '$$$$') DEFAULT '$$',
    capacidad INT,
    horario JSON,
    menu JSON,
    fotos JSON,
    rating DECIMAL(3,2) DEFAULT 0,
    total_resenas INT DEFAULT 0,
    status ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_tipo_cocina (tipo_cocina),
    INDEX idx_precio_rango (precio_rango),
    INDEX idx_rating (rating),
    FULLTEXT idx_busqueda (nombre, descripcion, tipo_cocina, menu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: disponibilidad
-- ============================================
CREATE TABLE IF NOT EXISTS disponibilidad (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    tipo ENUM('hotel', 'tour', 'evento', 'restaurant') NOT NULL,
    referencia_id INT NOT NULL,
    fecha DATE NOT NULL,
    disponibles INT DEFAULT 0,
    precio DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    UNIQUE KEY idx_unico (tipo, referencia_id, fecha),
    INDEX idx_fecha (fecha),
    INDEX idx_disponibles (disponibles)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reservas
-- ============================================
CREATE TABLE IF NOT EXISTS reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    tipo ENUM('hotel', 'tour', 'evento', 'restaurant') NOT NULL,
    referencia_id INT NOT NULL,
    numero_reserva VARCHAR(20) UNIQUE NOT NULL,
    fecha_reserva DATETIME NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    personas INT DEFAULT 1,
    precio_total DECIMAL(10,2) NOT NULL,
    status ENUM('pendiente', 'confirmada', 'cancelada', 'completada', 'no_show') DEFAULT 'pendiente',
    metodo_pago ENUM('tarjeta', 'efectivo', 'transferencia', 'mercadopago') NOT NULL,
    transaccion_id VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_fecha_reserva (fecha_reserva),
    INDEX idx_status (status),
    INDEX idx_numero_reserva (numero_reserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: pagos
-- ============================================
CREATE TABLE IF NOT EXISTS pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reserva_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo ENUM('tarjeta', 'efectivo', 'transferencia', 'mercadopago') NOT NULL,
    status ENUM('pendiente', 'completado', 'fallido', 'reembolsado', 'cancelado') DEFAULT 'pendiente',
    transaccion_id VARCHAR(100),
    referencia VARCHAR(100),
    detalles JSON,
    fecha_pago DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id),
    INDEX idx_status (status),
    INDEX idx_transaccion (transaccion_id),
    INDEX idx_fecha_pago (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: reseñas
-- ============================================
CREATE TABLE IF NOT EXISTS reseñas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    tipo ENUM('hotel', 'tour', 'evento', 'restaurant') NOT NULL,
    referencia_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    titulo VARCHAR(200),
    comentario TEXT,
    fotos JSON,
    status ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    respuesta TEXT,
    fecha_respuesta DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_tipo_referencia (tipo, referencia_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status),
    FULLTEXT idx_comentario (titulo, comentario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: favoritos
-- ============================================
CREATE TABLE IF NOT EXISTS favoritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('hotel', 'tour', 'evento', 'restaurant', 'proveedor') NOT NULL,
    referencia_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY idx_unico (usuario_id, tipo, referencia_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo_referencia (tipo, referencia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: notificaciones
-- ============================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('info', 'success', 'warning', 'error', 'reserva', 'pago', 'review') DEFAULT 'info',
    leido BOOLEAN DEFAULT FALSE,
    enlace VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_leido (leido),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: configuraciones
-- ============================================
CREATE TABLE IF NOT EXISTS configuraciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    descripcion TEXT,
    categoria VARCHAR(50),
    editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clave (clave),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: logs
-- ============================================
CREATE TABLE IF NOT EXISTS logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    detalles JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id),
    INDEX idx_accion (accion),
    INDEX idx_modulo (modulo),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: categorias
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('hotel', 'tour', 'evento', 'restaurant') NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    color VARCHAR(20),
    orden INT DEFAULT 0,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_status (status),
    INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: promociones
-- ============================================
CREATE TABLE IF NOT EXISTS promociones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('descuento', 'paquete', 'temporada') NOT NULL,
    descuento_porcentaje DECIMAL(5,2),
    precio_promocion DECIMAL(10,2),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    condiciones TEXT,
    fotos JSON,
    status ENUM('activo', 'inactivo', 'expirado') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_status (status),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERCIÓN DE DATOS INICIALES
-- ============================================

-- Insertar usuario administrador
INSERT INTO usuarios (nombre, email, password, tipo, status) VALUES
('Administrador NEMI', 'admin@nemi.mx', '$2b$10$YourHashedPasswordHere', 'admin', 'activo')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insertar configuraciones iniciales
INSERT INTO configuraciones (clave, valor, tipo, descripcion, categoria) VALUES
('sitio_nombre', 'NEMI Plataforma Turística', 'string', 'Nombre del sitio web', 'general'),
('sitio_descripcion', 'Plataforma turística oficial de Zacatlán y Chignahuapan', 'string', 'Descripción del sitio', 'general'),
('contacto_email', 'hola@nemi.mx', 'string', 'Email de contacto principal', 'contacto'),
('contacto_telefono', '7979751045', 'string', 'Teléfono de contacto', 'contacto'),
('contacto_direccion', 'Zacatlán, Puebla', 'string', 'Dirección física', 'contacto'),
('moneda', 'MXN', 'string', 'Moneda principal', 'finanzas'),
('comision_porcentaje', '15', 'number', 'Porcentaje de comisión', 'finanzas'),
('impuesto_porcentaje', '16', 'number', 'Porcentaje de impuesto', 'finanzas'),
('costo_envio', '100', 'number', 'Costo de envío estándar', 'finanzas'),
('dias_cancelacion_gratis', '2', 'number', 'Días para cancelación gratuita', 'reservas'),
('politica_privacidad', 'Texto de política de privacidad...', 'string', 'Política de privacidad', 'legal'),
('terminos_condiciones', 'Texto de términos y condiciones...', 'string', 'Términos y condiciones', 'legal')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP, valor = VALUES(valor);

-- Insertar categorías
INSERT INTO categorias (nombre, tipo, descripcion, icono, color, orden) VALUES
('Hoteles Boutique', 'hotel', 'Hoteles pequeños con diseño único', 'fa-hotel', '#3498db', 1),
('Cabañas', 'hotel', 'Cabañas en medio de la naturaleza', 'fa-home', '#2ecc71', 2),
('Hostales', 'hotel', 'Alojamiento económico y social', 'fa-bed', '#e74c3c', 3),
('Tours de Aventura', 'tour', 'Experiencias llenas de adrenalina', 'fa-hiking', '#f39c12', 1),
('Tours Culturales', 'tour', 'Conoce la historia y tradiciones', 'fa-landmark', '#9b59b6', 2),
('Tours Gastronómicos', 'tour', 'Degustación de platillos típicos', 'fa-utensils', '#e74c3c', 3),
('Festivales', 'evento', 'Eventos musicales y culturales', 'fa-music', '#3498db', 1),
('Ferias', 'evento', 'Ferias tradicionales y comerciales', 'fa-ferris-wheel', '#2ecc71', 2),
('Eventos Religiosos', 'evento', 'Celebraciones y procesiones', 'fa-church', '#f39c12', 3),
('Comida Tradicional', 'restaurant', 'Platillos típicos de la región', 'fa-utensil-spoon', '#e74c3c', 1),
('Cafeterías', 'restaurant', 'Café y alimentos ligeros', 'fa-coffee', '#8e44ad', 2),
('Gourmet', 'restaurant', 'Experiencias culinarias exclusivas', 'fa-crown', '#f1c40f', 3)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista para estadísticas generales
CREATE OR REPLACE VIEW vista_estadisticas AS
SELECT 
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM proveedores WHERE verificacion = 'verificado') as total_proveedores,
    (SELECT COUNT(*) FROM hoteles WHERE status = 'activo') as total_hoteles,
    (SELECT COUNT(*) FROM tours WHERE status = 'activo') as total_tours,
    (SELECT COUNT(*) FROM eventos WHERE status = 'activo') as total_eventos,
    (SELECT COUNT(*) FROM reservas WHERE status = 'confirmada') as total_reservas,
    (SELECT SUM(precio_total) FROM reservas WHERE status = 'confirmada' AND MONTH(fecha_reserva) = MONTH(CURRENT_DATE())) as ingresos_mes_actual,
    (SELECT AVG(rating) FROM proveedores WHERE total_resenas > 0) as rating_promedio;

-- Vista para reservas recientes
CREATE OR REPLACE VIEW vista_reservas_recientes AS
SELECT 
    r.id,
    r.numero_reserva,
    r.tipo,
    r.fecha_inicio,
    r.fecha_fin,
    r.personas,
    r.precio_total,
    r.status,
    u.nombre as cliente_nombre,
    u.email as cliente_email,
    p.nombre_negocio as proveedor_nombre,
    r.created_at
FROM reservas r
JOIN usuarios u ON r.usuario_id = u.id
JOIN proveedores p ON r.proveedor_id = p.id
ORDER BY r.created_at DESC
LIMIT 100;

-- Vista para proveedores con mejor rating
CREATE OR REPLACE VIEW vista_proveedores_top AS
SELECT 
    p.id,
    p.nombre_negocio,
    p.tipo_negocio,
    p.ubicacion,
    p.rating,
    p.total_resenas,
    COUNT(r.id) as total_reservas,
    u.nombre as propietario
FROM proveedores p
JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN reservas r ON p.id = r.proveedor_id AND r.status = 'completada'
WHERE p.verificacion = 'verificado'
GROUP BY p.id
ORDER BY p.rating DESC, total_reservas DESC;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento para generar número de reserva
DELIMITER $$
CREATE PROCEDURE generar_numero_reserva(IN reserva_id INT)
BEGIN
    DECLARE nuevo_numero VARCHAR(20);
    SET nuevo_numero = CONCAT('NEMI-', DATE_FORMAT(NOW(), '%Y%m%d-'), LPAD(reserva_id, 6, '0'));
    
    UPDATE reservas 
    SET numero_reserva = nuevo_numero 
    WHERE id = reserva_id;
END$$
DELIMITER ;

-- Procedimiento para actualizar rating de proveedor
DELIMITER $$
CREATE PROCEDURE actualizar_rating_proveedor(IN proveedor_id INT)
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE total_reviews INT;
    
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, total_reviews
    FROM reseñas 
    WHERE proveedor_id = proveedor_id 
    AND status = 'aprobado';
    
    UPDATE proveedores 
    SET rating = COALESCE(avg_rating, 0), 
        total_resenas = total_reviews 
    WHERE id = proveedor_id;
END$$
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para actualizar rating automáticamente
DELIMITER $$
CREATE TRIGGER after_resena_insert
AFTER INSERT ON reseñas
FOR EACH ROW
BEGIN
    CALL actualizar_rating_proveedor(NEW.proveedor_id);
END$$
DELIMITER ;

-- Trigger para generar número de reserva automáticamente
DELIMITER $$
CREATE TRIGGER before_reserva_insert
BEFORE INSERT ON reservas
FOR EACH ROW
BEGIN
    IF NEW.numero_reserva IS NULL THEN
        SET NEW.numero_reserva = CONCAT('NEMI-', DATE_FORMAT(NOW(), '%Y%m%d-'), LPAD(NEW.id, 6, '0'));
    END IF;
END$$
DELIMITER ;

-- Trigger para crear notificación de nueva reserva
DELIMITER $$
CREATE TRIGGER after_reserva_insert
AFTER INSERT ON reservas
FOR EACH ROW
BEGIN
    -- Notificación para el proveedor
    INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, enlace)
    SELECT 
        p.usuario_id,
        'Nueva Reserva Recibida',
        CONCAT('Tienes una nueva reserva #', NEW.numero_reserva),
        'reserva',
        CONCAT('/admin/reservas/', NEW.id)
    FROM proveedores p
    WHERE p.id = NEW.proveedor_id;
    
    -- Notificación para el administrador
    INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, enlace)
    SELECT 
        u.id,
        'Nueva Reserva en el Sistema',
        CONCAT('Reserva #', NEW.numero_reserva, ' creada por ', (SELECT nombre FROM usuarios WHERE id = NEW.usuario_id)),
        'reserva',
        CONCAT('/admin/reservas/', NEW.id)
    FROM usuarios u
    WHERE u.tipo = 'admin'
    LIMIT 1;
END$$
DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================
CREATE INDEX idx_reservas_fechas ON reservas(fecha_inicio, fecha_fin);
CREATE INDEX idx_disponibilidad_completo ON disponibilidad(tipo, referencia_id, fecha, disponibles);
CREATE INDEX idx_resenas_proveedor_tipo ON reseñas(proveedor_id, tipo, referencia_id);
CREATE INDEX idx_pagos_fecha_status ON pagos(fecha_pago, status);

-- ============================================
-- CONFIGURACIÓN DE PERMISOS
-- ============================================
-- Crear usuario para la aplicación (ajusta la contraseña)
CREATE USER IF NOT EXISTS 'nemi_app'@'localhost' IDENTIFIED BY 'TuContraseñaSegura123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON nemi_db.* TO 'nemi_app'@'localhost';
FLUSH PRIVILEGES;

-- ============================================
-- MENSAJE FINAL
-- ============================================
SELECT '✅ Base de datos NEMI creada exitosamente!' as mensaje;