-- SQLBook: Code
-- ------ Borrar BBDD anterior si existe ------
DROP DATABASE IF EXISTS TareApp;

-- ------ Crear BBDD nueva ------
CREATE DATABASE TareApp
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

-- Seleccionar BBDD recién creada
USE TareApp;

-- ------ Crear tablas ------

-- Usuario
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enabled INT NOT NULL DEFAULT 1,
  access_user VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name1 VARCHAR(255) NOT NULL,
  last_name2 VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  photo BLOB,
  userType ENUM('alumno', 'padre', 'profesor') NOT NULL,
  id_parent INT,

  CONSTRAINT UC_user  UNIQUE(access_user),
  FOREIGN KEY (id_parent) REFERENCES user(id)
);

-- Configuración
CREATE TABLE configuration (
  id_user INT NOT NULL PRIMARY KEY,
  font_size ENUM('grande', 'normal') NOT NULL,
  theme  ENUM('alegre', 'minimalista') NOT NULL,
  time_preference ENUM('largo', 'corto') NOT NULL,

  FOREIGN KEY (id_user) REFERENCES user(id)
);

-- Suscripción
CREATE TABLE subscription (
  id_user INT NOT NULL PRIMARY KEY,
  endpoint VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  p256dh VARCHAR(255) NOT NULL,

  FOREIGN KEY (id_user) REFERENCES user(id)
);

-- SesiónEstudio
CREATE TABLE studySession (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(255) NOT NULL,
  id_user INT NOT NULL,
  study_slot INT NOT NULL,
  brake_slot INT NOT NULL,
  long_brake_slot INT,
  num_slots INT NOT NULL,

  CONSTRAINT UC_studySession UNIQUE(name, id_user),
  FOREIGN KEY (id_user) REFERENCES user(id)
);

-- Asignatura
CREATE TABLE subject (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enabled INT NOT NULL DEFAULT 1,
  id_teacher INT NOT NULL, 
  name VARCHAR(255) NOT NULL,
  grade VARCHAR(255) NOT NULL,
  subject_icon VARCHAR(255) NOT NULL,
  subject_color VARCHAR(255) NOT NULL,

  CONSTRAINT UC_subject UNIQUE(id_teacher, name, grade),
  FOREIGN KEY (id_teacher) REFERENCES user(id)
);

-- Orden
CREATE TABLE preference (
  id_configuration INT NOT NULL,
  id_subject INT NOT NULL,
  position INT NOT NULL,

  PRIMARY KEY (id_configuration, id_subject, position),
  FOREIGN KEY (id_configuration) REFERENCES configuration(id_user),
  FOREIGN KEY (id_subject) REFERENCES subject(id)
);

-- Cursa
CREATE TABLE study (
  id_student INT NOT NULL,
  id_subject INT NOT NULL,

  PRIMARY KEY (id_student, id_subject),
  FOREIGN KEY (id_student) REFERENCES user(id),
  FOREIGN KEY (id_subject) REFERENCES subject(id)
);

-- Categoría
CREATE TABLE category (
  name  VARCHAR(255) NOT NULL PRIMARY KEY,
  category_icon VARCHAR(255) NOT NULL,
  category_color VARCHAR(255) NOT NULL
);

-- Recompensa
CREATE TABLE reward (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message VARCHAR(255),
  icon VARCHAR(255) NOT NULL
);

-- Actividad
CREATE TABLE activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enabled INT NOT NULL DEFAULT 1,
  id_creator INT NOT NULL,
  id_receiver INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  description VARCHAR(255),
  reminder ENUM('1 día antes', 'Desde 2 días antes', 'Desde 1 semana antes', 'No recordarmelo') NOT NULL,
  category VARCHAR(255) NOT NULL,
  id_subject INT,

  FOREIGN KEY (id_creator) REFERENCES user(id),
  FOREIGN KEY (id_receiver) REFERENCES user(id),
  FOREIGN KEY (category) REFERENCES category(name),
  FOREIGN KEY (id_subject) REFERENCES subject(id)
);

-- Evento
CREATE TABLE event (
  id_activity INT NOT NULL PRIMARY KEY,
  recurrent INT NOT NULL,
  duration INT NOT NULL,

  FOREIGN KEY (id_activity) REFERENCES activity(id)
);

-- Tarea
CREATE TABLE task (
  id_activity INT NOT NULL PRIMARY KEY,
  completed INT NOT NULL DEFAULT 0,
  duration ENUM('corta', 'media', 'larga', 'no lo sé') NOT NULL,
  id_event INT,
  id_reward INT NOT NULL,

  FOREIGN KEY (id_activity) REFERENCES activity(id),
  FOREIGN KEY (id_event) REFERENCES event(id_activity),
  FOREIGN KEY (id_reward) REFERENCES reward(id)
);

-- Recordatorio
CREATE TABLE reminder (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enabled INT NOT NULL DEFAULT 1,
  id_sender INT,
  id_receiver INT NOT NULL,
  id_activity INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_date TIMESTAMP NULL,

  CONSTRAINT UC_reminder UNIQUE(id_sender, id_receiver, sent_date),
  FOREIGN KEY (id_sender) REFERENCES user(id),
  FOREIGN KEY (id_receiver) REFERENCES user(id),
  FOREIGN KEY (id_activity) REFERENCES activity(id)
);

-- ------ Insertar datos de prueba ------

-- Usuario
INSERT INTO user (access_user, first_name, last_name1, last_name2, password, photo, userType) VALUES
('clarar05', 'Clara', 'Rodríguez', 'Prieto', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', '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','alumno'),
('anamam20', 'Ana', 'Martínez', 'Valdés', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', '', 'alumno'),
('cacalv04', 'Carlos', 'Calvo', 'Martínez', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', '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', 'alumno'),
('jorsie01', 'Jorge', 'Sierra', 'Alonso', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', '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', 'alumno'),
('lucbravo', 'Lucas', 'Bravo', 'Fairen', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', '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', 'alumno'),
('virginia', 'Virginia', 'Francisco', 'Gilmartin', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', NULL, 'profesor'),
('raquelHB', 'Raquel', 'Hervás', 'Ballesteros', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', NULL, 'profesor');

-- Configuración
INSERT INTO configuration (id_user, font_size, theme, time_preference) VALUES
(1, 'normal', 'alegre', 'corto'),
(2, 'normal', 'alegre', 'corto'),
(3, 'normal', 'alegre', 'corto'),
(4, 'normal', 'alegre', 'corto'),
(5, 'normal', 'alegre', 'corto'),
(6, 'normal', 'alegre', 'corto'),
(7, 'normal', 'alegre', 'corto');

-- Suscripción

-- SesiónEstudio

-- Asignatura
INSERT INTO subject (id_teacher, name, grade, subject_icon, subject_color) VALUES 
(6, 'Matemáticas', '1 ESO', '&#128290;', 'naranja'),
(6, 'Literatura', '1 ESO', '&#128214;', 'azul'),
(6, 'Historia', '1 ESO', '&#128506;', 'rojo'),
(6, 'Ciencias', '1 ESO', '&#129514;', 'verde');

-- Orden

-- Cursa

-- Categoría
INSERT INTO category (name, category_icon, category_color) VALUES
('Escolar', '&#128218;', 'rojo'),
('Ocio', '&#x1F389;', 'morado'),
('Extraescolar', '&#127934;', 'verde'),
('Casa', '&#127968;', 'rosa');

-- Recompensa
INSERT INTO reward (title, message, icon) VALUES
('¡Ánimo!', null, 'lets-go'),
('¡Genial!', null, 'awesome'),
('¡Increíble!', 'Este supergato te felicita', 'supercat'),
('¡Buen trabajo!', 'Vas por buen camino', 'good-job'),
('¡Enhorabuena!', 'Has ganado una medalla espacial', 'star-medal');

-- Actividad
INSERT INTO activity (id_creator, id_receiver, title, date, time, description, reminder, category) VALUES
(5, 5, 'Tarea 1', '2024-04-25', '13:20:00', 'Primera tarea de prueba', 'Desde 2 días antes', 'Ocio'),
(5, 5, 'Tarea 2', '2024-04-22', '13:20:00', 'Segunda tarea de prueba', 'Desde 2 días antes', 'Ocio'),
(5, 5, 'Tarea 3', '2024-04-20', '13:20:00', 'Tercera tarea de prueba', 'Desde 2 días antes', 'Casa'),
(5, 5, 'Tarea 4', '2024-04-15', '13:20:00', 'Cuarta tarea de prueba', 'Desde 2 días antes', 'Casa');

-- Evento

-- Tarea
INSERT INTO task (id_activity, completed, duration, id_reward) VALUES
(1, false, 'no lo sé', 1),
(2, false, 'corta', 1),
(3, true, 'media', 4),
(4, true, 'larga', 4);

-- Recordatorio
INSERT INTO reminder (id_receiver, id_activity, message, sent_date) VALUES 
(5, 1, 'Mañana termina el plazo para la tarea "Tarea 1"¡A por ello, tú puedes!', '2024-04-24 08:00:00'),
(5, 1, '¡Ánimo! Aún te quedan 2 días para terminar la tarea "Tarea 1"', '2024-04-23 08:00:00'),
(5, 2, 'Mañana termina el plazo para la tarea "Tarea 2"¡A por ello, tú puedes!', '2024-04-21 08:00:00'),
(5, 2, '¡Ánimo! Aún te quedan 2 días para terminar la tarea "Tarea 2"', '2024-04-20 8:00:00'),
(5, 3, 'Mañana termina el plazo para la tarea "Tarea 3"¡A por ello, tú puedes!', '2024-04-19 08:00:00'),
(5, 3, '¡Ánimo! Aún te quedan 2 días para terminar la tarea "Tarea 3"', '2024-04-18 08:00:00'),
(5, 4, 'Mañana termina el plazo para la tarea "Tarea 4"¡A por ello, tú puedes!', '2024-04-14 08:00:00'),
(5, 4, '¡Ánimo! Aún te quedan 2 días para terminar la tarea "Tarea 4"', '2024-04-13 08:00:00');