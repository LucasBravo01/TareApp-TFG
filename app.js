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
const { check, validationResult } = require("express-validator");
const cron = require('node-cron');

// Fichero
const connection = require("./daos/connection");
const DAOCategoria = require("./daos/DAOCategoria");
const DAOUser = require("./daos/DAOUser");
const ControllerCategoria = require("./controllers/controllerCategoria");
const ControllerUser = require("./controllers/controllerUser");
const DAOTarea = require("./daos/DAOTarea");
const ControllerTarea = require("./controllers/controllerTarea");
const DAOActividad = require("./daos/DAOActividad");
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
const daoCat = new DAOCategoria(pool);
const daoUse = new DAOUser(pool);
const daoTarea = new DAOTarea(pool);
const daoActividad = new DAOActividad(pool);

// Crear instancias de los Controllers
const conCat = new ControllerCategoria(daoCat);
const conUse = new ControllerUser(daoUse, daoCat);

//ESTO NO SE COMO FUNCIONA
//const useController = new UserController(daoUse, daoUni, daoFac, daoMes);
const conTarea = new ControllerTarea(daoTarea, daoActividad );

// --- Routers ---
routerPrototipo.routerConfig(conCat,conTarea);

app.use("/prototipo", routerPrototipo.RouterPrototipo);

// --- Middlewares ---
// Comprobar que el usuario ha iniciado sesión
function userLogged(request, response, next) {
  if (request.session.currentUser) {
      next();
  }
  else {
      response.redirect("/login");
  }
};

// Comprobar que el usuario no había iniciado sesión
function userAlreadyLogged(request, response, next) {
  if (request.session.currentUser) {
      response.redirect("/inicio");
  }
  else {
      next();
  }
};

// --- Peticiones GET ---
// - Enrutamientos -
app.get('/categorias', userLogged, conCat.getCategorias);

// Login
app.get("/login", (request, response, next) => {
  response.render("login", { user: "", response: undefined });
});

//Inicio
app.get(["/", "/inicio"], userLogged, conCat.getCategorias);

app.get("/crearTarea", (request, response, next) => {
  next({
    ajax: false,
    status: 200,
    redirect: "crearTarea",
    data: {
        response: undefined,
        generalInfo: {}
    }
  });
});

// --- Peticiones POST ---
// Login
app.post(
  "/login",
  // Ninguno de los campos vacíos 
  check("user", "1").notEmpty(),
  check("password", "1").notEmpty(),
  conUse.login
);

// Logout
app.post("/logout", conUse.logout);
app.post("/crearTareaForm", conTarea.crearTarea);
// --- Otras funcionesF ---

// --- Middlewares de respuestas y errores ---
// Error 404
app.use((request, response, next) => {
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
app.use((responseData, request, response, next) => {
  // Respuestas AJAX
  if (responseData.ajax) {
      if (responseData.error) {
          response.status(responseData.status).send(responseData.error);
          response.end();
      }
      else if (responseData.img) {
          response.end(responseData.img);
      }
      else {
          response.json(responseData.data);
      }
  }
  // Respuestas no AJAX
  else {
    response.status(responseData.status);
    response.render(responseData.redirect, responseData.data);
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