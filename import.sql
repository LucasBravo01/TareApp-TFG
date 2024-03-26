DROP DATABASE IF EXISTS TareApp;

CREATE DATABASE TareApp
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_spanish_ci;

-- Seleccionar la base de datos recién creada
USE TareApp;

-- Crear tablas
CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    icono VARCHAR(255),
    autor VARCHAR(255),
    curso VARCHAR(255)
);


-- Crear Datos
INSERT INTO categoria (nombre, icono, autor, curso) VALUES
("Prueba 1", "cat1", "Yo", "1º"),
("Prueba 2", "cat1", "Yo", "2º"),
("Prueba 3", "cat1", "Yo", "3º"),
("Prueba 4", "cat1", "Yo", "4º");