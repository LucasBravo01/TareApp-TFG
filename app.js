"use strict";

// --- Importar módulos ---
// Core
const path = require("path");

// Paquete
const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const sessionMySql = require("express-mysql-session");
const morgan = require("morgan");
const cron = require('node-cron');

// Fichero
const connection = require("./daos/connection");
const DAOTareas = require("./daos/DAOTareas");
const DAOSuscripción = require("./daos/DAOSuscripción");
const ControllerPrototipo = require("./controllers/controllerPrototipo");
const routerPrototipo = require("./routes/RouterPrototipo");

// --- Crear aplicación Express ---
const app = express();

// --- EJS ---
app.set("view engine", "ejs"); // Configurar EJS como motor de plantillas
app.set("views", path.join(__dirname, "views")); // Definir el directorio de plantillas

// --- BodyParser (Express) ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());//Para poder usar ajax y que se pasen los datos en formato json

// --- Static ---
app.use(express.static(path.join(__dirname, "public"))); // Gestionar ficheros estáticos con static

// --- Morgan ---
app.use(morgan("dev")); // Imprimir peticiones recibidas

// --- Sesiones y MySQL ---
// Sesión MySQL
const MySQLStore = sessionMySql(session);
const sessionStore = new MySQLStore(connection.mysqlConfig);

// Crear middleware de la sesión
const middlewareSession = session({
  saveUninitialized: false,
  secret: "sesion01",
  resave: false,
  store: sessionStore
});
app.use(middlewareSession);


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// --- Web-Push ---
const webpush = require('web-push'); // Importar web-push
// Configuración de web-push (debes configurar tus propias claves)
// Configura tus propias claves VAPID
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log("Clave pública VAPID:", vapidKeys.publicKey);
// console.log("Clave privada VAPID:", vapidKeys.privateKey);
const publicVapidKey = 'BLCnzXg8xUoWfMEHgv6LvbweKvD8gPFnhDFa_itdDK-k7UvZhthfW9KyIRopraMi5mhaXqEMXitX22g-4kJNs7g';
const privateVapidKey = 'RQL25CNQAqpZHFJuCVKmP2kpDpeuRKZhNbK-N1Ijouc';
webpush.setVapidDetails('mailto:your_email@example.com', publicVapidKey, privateVapidKey);



// Crear pool de conexiones
const pool = mysql.createPool(connection.mysqlConfig);

// --- DAOs y Controllers ---
// Crear instancias de los DAOs
const daoTar = new DAOTareas(pool);
const daoSus = new DAOSuscripción(pool);
// Crear instancias de los Controllers
const conPro = new ControllerPrototipo(daoTar, daoSus);

// --- Routers ---
routerPrototipo.routerConfig(conPro);

app.use("/prototipo", routerPrototipo.RouterPrototipo);

// --- Peticiones GET ---
// - Enrutamientos -
app.get(['/', '/vistaView'], (req, res) => {
  res.render('vistaView');
});

app.get('/listarTareasView', (req, res) => {
  res.render('listarTareasView');
});

// --- POSTS ---

// Ruta para recibir y guardar la suscripción desde el cliente
app.post('/guardar-suscripcion', (req, res) => {
  const subscription = req.body.subscription;
  console.log('Ha peido enviar notificaciones')
  daoSus.guardarSuscripcion(subscription, (err) => {
    if (err) {
      console.error('Error al guardar la suscripción:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.status(200).json({ message: 'Suscripción guardada correctamente' });
  });
});

// Ruta para enviar notificaciones push
app.post('/enviar-notificacion', (req, res) => {
  const notificationPayload = {
    notification: {
      title: '¡Nuevo mensaje!',
      body: '¡Tienes un nuevo mensaje!',
      icon: 'path_to_icon.png' // Ruta al icono de la notificación
    }
  };

  daoSus.getAllSubscriptions((err, subscriptions) => {
    if (err) {
      console.error('Error al obtener suscripciones:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }

    Promise.all(subscriptions.map(sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload))))
      .then(() => {
        console.log('Notificaciones enviadas con éxito');
        res.status(200).json({ message: 'Notificaciones enviadas con éxito' });
      })
      .catch(err => {
        console.error('Error al enviar notificaciones:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      });
  });
});


// --- Otras funciones ---

// Función para enviar notificaciones cada 5 segundos
function enviarNotificacionAutomatica() {
  const notificationPayload = {
    notification: {
      title: '¡Nuevo mensaje!',
      body: '¡Tienes un nuevo mensaje!',
      icon: '/images/icon-192x192.png' // Ruta al icono de la notificación
    }
  };

  daoSus.getAllSubscriptions((err, subscriptions) => {
    if (err) {
      console.error('Error al obtener suscripciones:', err);
      return;
    }

    subscriptions.forEach(subscription => {
      webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
        .then(() => console.log('Notificación enviada con éxito a', subscription.endpoint))
        .catch(err => console.error('Error al enviar notificación a', subscription.endpoint, ':', err));
    });
  });
}

// Programar la tarea para enviar notificaciones cada 9 segundos
cron.schedule('*/9 * * * * *', () => {
  console.log('Enviando notificaciones...');
  enviarNotificacionAutomatica();
});

// --- Arrancar el servidor ---
app.listen(connection.port, function (err) {
  if (err) {
    console.log("ERROR al iniciar el servidor"); //Error al iniciar el servidor
  } else { console.log(`Servidor arrancado en el puerto localhost:${connection.port}`); } //Exito al iniciar el servidor
});