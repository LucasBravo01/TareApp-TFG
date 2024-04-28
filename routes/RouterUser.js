"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");
const { check, validationResult } = require("express-validator");

// --- Crear router ---
const RouterUser = express.Router();

// Obtener pool
function routerConfig(conUse, conRem) {

    // --- Peticiones GET ---
    // Perfil usuario
    RouterUser.get("/perfil", conRem.unreadNotifications, conUse.getProfile);

    // Configuración
    RouterUser.get("/configuracion", conRem.unreadNotifications, conUse.getConfiguration);

    // - Otras peticiones GET -
    // Imagen del usuario
    RouterUser.get(
        "/fotoPerfil/:id",
        check("id", "-2").isNumeric(),
        conUse.getProfilePic
    );

    // --- Peticiones POST ---
    // Cambiar la configuración del usuario
    RouterUser.post("/guardarConfiguracion",
        // Campos de enums válidos
        check("font_size", "5").custom((fontS) => {
            return (fontS === "grande" || fontS === "normal")
        }),
        check("theme", "6").custom((theme) => {
            return (theme === "alegre" || theme === "minimalista")
        }),
        check("time_preference", "7").custom((timeP) => { // TODO Borrar?
            return (timeP === "corto" || timeP === "largo")
        }),
        conRem.unreadNotifications,
        conUse.updateConfiguration
    );
}

module.exports = {
    RouterUser: RouterUser,
    routerConfig: routerConfig
};