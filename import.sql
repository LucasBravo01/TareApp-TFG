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
  font_size INT NOT NULL,
  theme INT NOT NULL,
  time_preference INT NOT NULL,

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
  photo BLOB,
  color VARCHAR(255) NOT NULL,

  CONSTRAINT UC_subject UNIQUE(id_teacher, name, grade),
  FOREIGN KEY (id_teacher) REFERENCES user(id)
);

-- Recordatorio
CREATE TABLE reminder (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_sender INT NOT NULL,
  id_receiver INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_date TIMESTAMP NULL,

  CONSTRAINT UC_reminder UNIQUE(id_sender, id_receiver, sent_date),
  FOREIGN KEY (id_sender) REFERENCES user(id),
  FOREIGN KEY (id_receiver) REFERENCES user(id)
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
  icon VARCHAR(255) NOT NULL
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
  photo BLOB,
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

-- ------ Insertar datos de prueba ------

-- Usuario
INSERT INTO user (access_user, first_name, last_name1, last_name2, password, userType) VALUES
('clarar05', 'Clara', 'Rodríguez', 'Prieto', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
('anamam20', 'Ana', 'Martínez', 'Valdés', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
('cacalv04', 'Carlos', 'Calvo', 'Martínez', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
('jorsie01', 'Jorge', 'Sierra', 'Alonso', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
('lucbravo', 'Lucas', 'Bravo', 'Fairen', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
('virginia', 'Virginia', 'Francisco', 'Gilmartin', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'profesor'),
('raquelHB', 'Raquel', 'Hervás', 'Ballesteros', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'profesor');

-- Configuración

-- Suscripción

-- SesiónEstudio

-- Asignatura
INSERT INTO subject (id_teacher, name, grade, photo, color) VALUES 
(6, 'Matemáticas', '1 ESO', NULL, 'Blue'),
(6, 'Literatura', '1 ESO', NULL, 'Red'),
(6, 'Historia', '1 ESO', NULL, 'Green'),
(6, 'Ciencias', '1 ESO', NULL, 'Yellow');

-- Recordatorio

-- Orden

-- Cursa

-- Categoría
INSERT INTO category (name, icon) VALUES
('Escolar', 'escolar'),
('Ocio', 'ocio'),
('Extraescolar', 'extraEscolar'),
('Casa', 'casa');

-- Recompensa
INSERT INTO reward (title, message, icon) VALUES
('¡Ánimo!', null, 'lets-go'),
('¡Genial!', null, 'awesome'),
('¡Increíble!', 'Este supergato te felicita', 'supercat'),
('¡Buen trabajo!', 'Vas por buen camino', 'good-job'),
('¡Enhorabuena!', 'Has ganado una medalla espacial', 'medalla-estrella');

-- Actividad
INSERT INTO activity (id_creator, id_receiver, title, date, time, description, reminder, category) VALUES
(5, 5, 'Tarea 1', '2024-04-07', '13:20:00', 'Primera tarea de prueba', 'No recordarmelo', 'Ocio'),
(5, 5, 'Tarea 2', '2024-04-07', '13:20:00', 'Segunda tarea de prueba', 'No recordarmelo', 'Ocio'),
(5, 5, 'Tarea 3', '2024-04-07', '13:20:00', 'Tercera tarea de prueba', 'No recordarmelo', 'Ocio');

-- Evento

-- Tarea
INSERT INTO task (id_activity, completed, duration, id_reward) VALUES
(1, false, 'no lo sé', 1),
(2, true, 'media', 1),
(3, true, 'larga', 4);