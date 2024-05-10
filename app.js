"use strict"

// --- Importar módulos ---
// Core
const path = require("path");
const moment = require('moment');

// Paquete
const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const sessionMySql = require("express-mysql-session");
const morgan = require("morgan");
const { check, validationResult } = require("express-validator");
const cron = require('node-cron');

// Fichero
// DAOS
const connection = require("./daos/connection");
const DAOActivity = require("./daos/DAOActivity");
const DAOCategory = require("./daos/DAOCategory");
const DAOReminder = require("./daos/DAOReminder");
const DAOReward = require("./daos/DAOReward");
const DAOSubject = require("./daos/DAOSubject");
const DAOSubscription = require("./daos/DAOSubscription");
const DAOTask = require("./daos/DAOTask");
const DAOUser = require("./daos/DAOUser");
const DAOConfiguration = require("./daos/DAOConfiguration");
// Controllers
const ControllerReminder = require("./controllers/controllerReminder");
const ControllerTask = require("./controllers/controllerTask");
const ControllerUser = require("./controllers/controllerUser");
// Routers
const routerTask = require("./routes/RouterTask");
const routerUser = require("./routes/RouterUser");
const routerReminder = require("./routes/RouterReminder");

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

// TODO Que hace esto?
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Crear pool de conexiones
const pool = mysql.createPool(connection.mysqlConfig);

// --- DAOs y Controllers ---
// Crear instancias de los DAOs
const daoAct = new DAOActivity(pool);
const daoCat = new DAOCategory(pool);
const daoCon = new DAOConfiguration(pool);
const daoRem = new DAOReminder(pool);
const daoRew = new DAOReward(pool);
const daoSub = new DAOSubject(pool);
const daoSubs = new DAOSubscription(pool);
const daoTas = new DAOTask(pool);
const daoUse = new DAOUser(pool);
// Crear instancias de los Controllers
const conRem = new ControllerReminder(daoRem, daoSubs);
const conTas = new ControllerTask(daoAct, daoCat, daoRem, daoRew, daoSub, daoTas, daoUse);
const conUse = new ControllerUser(daoAct, daoCon, daoRem, daoRew, daoUse);

// --- Middlewares ---
// Comprobar que el usuario ha iniciado sesión
function userLogged(req, res, next) {
  if (req.session.currentUser) {
    next();
  }
  else {
    res.redirect("/login");
  }
};

// Comprobar que el usuario no había iniciado sesión
function userAlreadyLogged(req, res, next) {
  if (req.session.currentUser) {
    res.redirect("/inicio");
  }
  else {
    next();
  }
};

// --- Routers ---
routerTask.routerConfig(conTas, conRem);
routerUser.routerConfig(conUse, conRem);
routerReminder.routerConfig(conRem);

app.use("/tareas", userLogged, routerTask.RouterTask);
app.use("/usuario", userLogged, routerUser.RouterUser);
app.use("/recordatorio", userLogged, routerReminder.RouterReminder);

// --- Peticiones GET ---
// - Enrutamientos -
// Login
app.get("/login", userAlreadyLogged, (req, res, next) => {
  next({
    ajax: false,
    status: 200,
    redirect: "login",
    data: {
      user: "",
      response: undefined
    }
  });
});

// Inicio
app.get(["/", "/inicio"], userLogged, conRem.unreadReminders, conTas.getTasks);

// Calendario semanal
app.get("/semanal/:day",
  check("day", "-2").custom((day) => {
    return moment(day, 'YYYY-MM-DD', true).isValid()
  }),
  userLogged,
  conRem.unreadReminders,
  conTas.getWeeklyTasks
);

// Calendario diario
app.get("/diaria/:day",
  check("day", "-2").custom((day) => {
    return moment(day, 'YYYY-MM-DD', true).isValid()
  }),
  userLogged,
  conRem.unreadReminders,
  conTas.getDailyTasks
);

// --- Peticiones POST ---
// Login
app.post("/login",
  // Ninguno de los campos vacíos 
  check("user", "1").notEmpty(),
  check("password", "1").notEmpty(),
  conUse.login
);

// Logout
app.post("/logout", conUse.logout);

// --- Otras funciones ---
// Programar la tarea para que se ejecute todos los días a las 8 de la mañana
cron.schedule('* * * * *', () => {
  conRem.sendNotifications();
});

// --- Middlewares de respuestas y errores ---
// Error 404
app.use((req, res, next) => {
  next({
    ajax: false,
    status: 404,
    redirect: "error",
    data: {
      code: 404,
      title: "Oops! Página no encontrada :(",
      message: "La página a la que intentas acceder no existe."
    }
  });
});

// Manejador de respuestas 
app.use((responseData, req, res, next) => {
  // Respuestas AJAX
  if (responseData.ajax) {
    if (responseData.error) {
      res.status(responseData.status).send(responseData.error);
      res.end();
    }
    else if (responseData.img) {
      res.end(responseData.img);
    }
    else {
      res.json(responseData.data);
    }
  }
  // Respuestas no AJAX
  else {
    res.status(responseData.status);
    res.render(responseData.redirect, responseData.data);
  }
});

// --- Iniciar el servidor ---
app.listen(connection.port, (error) => {
  if (error) {
    console.error(`Se ha producido un error al iniciar el servidor: ${error.message}`);
  }
  else {
    console.log(`Se ha arrancado el servidor en el puerto ${connection.port}`);
  }
});