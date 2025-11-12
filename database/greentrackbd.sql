DROP DATABASE IF EXISTS greentrack;
CREATE DATABASE greentrack;
USE greentrack;

-- Tabla: USUARIO
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL
);

-- Tabla: EQUIPOS
CREATE TABLE equipments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    brand VARCHAR(255) NOT NULL,
    type varchar(255) NOT NULL,
    state ENUM('DISPONIBLE', 'PRESTADO') NOT NULL DEFAULT 'DISPONIBLE'
);


-- Tabla: PRESTAMOS
CREATE TABLE loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee VARCHAR(255) NOT NULL,
    loan_date DATETIME(6) NOT NULL,
    return_date DATETIME(6) NULL,
    state ENUM('ACTIVO', 'DEVUELTO') NOT NULL DEFAULT 'ACTIVO',
    equipment_id BIGINT NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id)
);

-- Inserción de Datos de Prueba
-- 1. Insertar 2 USUARIOS
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'ADMIN'),
('jperez', 'user123', 'USER');

-- 2. Insertar 12 Equipos
-- (Todos se insertan como 'DISPONIBLE')
INSERT INTO equipments (name, brand, type) VALUES
('Laptop Latitude 5490', 'Dell', 'LAPTOP'),
('Monitor UltraSharp 24"', 'Dell', 'MONITOR'),
('Teclado Inalámbrico MK270', 'Logitech', 'TECLADO'),
('Mouse MX Master 3', 'Logitech', 'MOUSE'),
('Impresora EcoTank L3210', 'Epson', 'IMPRESORA'),
('Laptop ThinkPad X1 Carbon', 'Lenovo', 'LAPTOP'),
('Monitor Curvo 27"', 'Samsung', 'MONITOR'),
('Teclado Magic Keyboard', 'Apple', 'TECLADO'),
('Mouse Ergonómico Vertical', 'Anker', 'MOUSE'),
('Laptop HP Spectre x360', 'HP', 'LAPTOP'),
('Monitor Gamer Odyssey G5', 'Samsung', 'MONITOR'),
('Impresora LaserJet Pro', 'HP', 'IMPRESORA');

-- 3. Insertar 3 Préstamos
-- (2 Activos y 1 Devuelto, para probar la lógica)
INSERT INTO loans (employee, loan_date, return_date, state, equipment_id) VALUES
('Juan Pérez', '2025-11-01T10:00:00', '2025-11-15T10:00:00', 'ACTIVO', 1);
UPDATE equipments SET state = 'PRESTADO' WHERE id = 1;

INSERT INTO loans (employee, loan_date, return_date, state, equipment_id) VALUES
('Maria Gómez', '2025-11-05T14:30:00', '2025-11-20T14:30:00', 'ACTIVO', 3);
UPDATE equipments SET state = 'PRESTADO' WHERE id = 3;

-- Préstamo 3: DEVUELTO
INSERT INTO loans (employee, loan_date, return_date, state, equipment_id) VALUES
('Rubén Gonzales', '2025-10-15T09:00:00', '2025-11-01T09:00:00', 'DEVUELTO', 2);

-- Lista: USUARIOS
select * from users;

-- Lista: EQUIPOS
select * from equipments;

-- Lista: PRESTAMOS
select * from loans;
