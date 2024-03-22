DROP DATABASE IF EXISTS Prototipo_TareApp;

CREATE DATABASE Prototipo_TareApp
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_spanish_ci;

-- Seleccionar la base de datos recién creada
USE Prototipo_TareApp;

CREATE TABLE asignaturas(
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50),
    Fecha DATE
);

CREATE TABLE suscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    p256dh VARCHAR(255) NOT NULL
);