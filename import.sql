  -- ------ Borrar BBDD anterior si existe ------
  DROP DATABASE IF EXISTS TareApp;

  -- ------ Crear BBDD nueva ------
  CREATE DATABASE TareApp
    DEFAULT CHARACTER SET utf8
    DEFAULT COLLATE utf8_spanish_ci;

  -- Seleccionar BBDD recién creada
  USE TareApp;

  -- ------ Crear tablas ------

  -- Usuario
  CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activo INT NOT NULL DEFAULT 1,
    usuario_acceso VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido1 VARCHAR(255) NOT NULL,
    apellido2 VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    foto BLOB,
    tipoUsuario ENUM('alumno', 'padre', 'profesor') NOT NULL,
    id_padre INT,

    CONSTRAINT UC_usuario UNIQUE(usuario_acceso),
    FOREIGN KEY (id_padre) REFERENCES usuario(id)
  );

  -- Configuración
  CREATE TABLE configuración (
    id_usuario INT NOT NULL PRIMARY KEY,
    tamaño_letra INT NOT NULL,
    tema INT NOT NULL,
    preferencia_tiempo INT NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
  );

  -- Suscripción
  CREATE TABLE suscripción (
    id_usuario INT NOT NULL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    p256dh VARCHAR(255) NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
  );

  -- SesiónEstudio
  CREATE TABLE sesiónEstudio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_usuario INT NOT NULL,
    slot_estudio INT NOT NULL,
    slot_descnaso INT NOT NULL,
    slot_descnaso_largo INT,
    num_slots INT NOT NULL,

    CONSTRAINT UC_sesiónEstudio UNIQUE(nombre, id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
  );

  -- Asignatura
  CREATE TABLE asignatura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activo INT NOT NULL DEFAULT 1,
    id_profesor INT NOT NULL, 
    nombre VARCHAR(255) NOT NULL,
    curso VARCHAR(255) NOT NULL,
    foto BLOB,
    color VARCHAR(255) NOT NULL,

    CONSTRAINT UC_asignatura UNIQUE(id_profesor, nombre, curso),
    FOREIGN KEY (id_profesor) REFERENCES usuario(id)
  );

  -- Recordatorio
  CREATE TABLE recordatorio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_emisor INT NOT NULL,
    id_receptor INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    fecha_envío TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_leído TIMESTAMP NULL,

    CONSTRAINT UC_recordatorio UNIQUE(id_emisor, id_receptor, fecha_envío),
    FOREIGN KEY (id_emisor) REFERENCES usuario(id),
    FOREIGN KEY (id_receptor) REFERENCES usuario(id)
  );

  -- Orden
  CREATE TABLE orden (
    id_configuración INT NOT NULL,
    id_asignatura INT NOT NULL,
    posición INT NOT NULL,

    PRIMARY KEY (id_configuración, id_asignatura, posición),
    FOREIGN KEY (id_configuración) REFERENCES configuración(id_usuario),
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id)
  );

  -- Cursa
  CREATE TABLE cursa (
    id_alumno INT NOT NULL,
    id_asignatura INT NOT NULL,

    PRIMARY KEY (id_alumno, id_asignatura),
    FOREIGN KEY (id_alumno) REFERENCES usuario(id),
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id)
  );

  -- Categoría
  CREATE TABLE categoria (
    nombre VARCHAR(255) NOT NULL PRIMARY KEY,
    icono VARCHAR(255) NOT NULL
  );

  -- Actividad
  CREATE TABLE actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activo INT NOT NULL DEFAULT 1,
    id_creador INT NOT NULL,
    id_destinatario INT NOT NULL,
    título VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    descripción VARCHAR(255),
    foto BLOB,
    recordatorio ENUM('1 día antes', 'Desde 2 días antes', 'Desde 1 semana antes', 'No recordarmelo') NOT NULL,
    categoría VARCHAR(255) NOT NULL,
    id_asignatura INT,

    FOREIGN KEY (id_creador) REFERENCES usuario(id),
    FOREIGN KEY (id_destinatario) REFERENCES usuario(id),
    FOREIGN KEY (categoría) REFERENCES categoria(nombre),
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id)
  );

  -- Evento
  CREATE TABLE evento (
    id_actividad INT NOT NULL PRIMARY KEY,
    recurrente INT NOT NULL,
    duración INT NOT NULL,

    FOREIGN KEY (id_actividad) REFERENCES actividad(id)
  );

  -- Recompensa
  CREATE TABLE recompensa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    título VARCHAR(255) NOT NULL,
    mensaje VARCHAR(255),
    icono VARCHAR(255) NOT NULL
  );

  -- Tarea
  CREATE TABLE tarea (
    id_actividad INT NOT NULL PRIMARY KEY,
    terminada INT NOT NULL DEFAULT 0,
    duración ENUM('corta', 'media', 'larga', 'no lo sé') NOT NULL,
    id_evento INT,
    id_recompensa INT,

    FOREIGN KEY (id_actividad) REFERENCES actividad(id),
    FOREIGN KEY (id_evento) REFERENCES evento(id_actividad),
    FOREIGN KEY (id_recompensa) REFERENCES recompensa(id)
  );

  -- ------ Insertar datos de prueba ------

  -- Usuario
  INSERT INTO usuario (usuario_acceso, nombre, apellido1, apellido2, contraseña, tipoUsuario) VALUES
  ('clarar05', 'Clara', 'Rodríguez', 'Prieto', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
  ('anamam20', 'Ana', 'Martínez', 'Valdés', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
  ('cacalv04', 'Carlos', 'Calvo', 'Martínez', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
  ('jorsie01', 'Jorge', 'Sierra', 'Alonso', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno'),
  ('lucbravo', 'Lucas', 'Bravo', 'Fairen', '$2b$10$0HR20Vb0gg7DpWQLEVMGhu0.rUxneq2MEjMGuRziTohrvKPB7IANe', 'alumno');

  -- Configuración

  -- Suscripción

  -- SesiónEstudio

  -- Asignatura

  -- Recordatorio

  -- Orden

  -- Cursa

  -- Categoría
  INSERT INTO categoria (nombre, icono) VALUES
  ('Escolar', 'escolar.png'),
  ('Ocio', 'ocio.png'),
  ('Extraescolar', 'extraEscolar.png'),
  ('Casa', 'casa.png');

  -- Actividad
  INSERT INTO actividad (id_creador, id_destinatario, título, fecha, hora, descripción, recordatorio, categoría) VALUES
  (5, 5, 'Tarea 1', '2024-04-07', '13:20:00', 'Primera tarea de prueba', 'No recordarmelo', 'Ocio'),
  (5, 5, 'Tarea 2', '2024-04-07', '13:20:00', 'Segunda tarea de prueba', 'No recordarmelo', 'Ocio'),
  (5, 5, 'Tarea 3', '2024-04-07', '13:20:00', 'Tercera tarea de prueba', 'No recordarmelo', 'Ocio');
  -- Evento

  -- Recompensa
  INSERT INTO recompensa (título, mensaje, icono) VALUES
  ('¡Ánimo!', null, 'lets-go.png'),
  ('¡Genial!', null, 'awesome.png'),
  ('¡Increíble!', 'Este supergato te felicita', 'supercat.png'),
  ('¡Buen trabajo!', 'Vas por buen camino', 'good-job.png'),
  ('¡Enhorabuena!', 'Has ganado una medalla espacial', 'lets-go.png');

  -- Tarea
  INSERT INTO tarea (id_actividad, duración, id_recompensa, terminada) VALUES
  (1, 'no lo sé', 1, false),
  (2, 'media', 1, true),
  (3, 'larga', 4, true);
