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
    RouterUser.get("/perfil", conRem.unreadNotifications, conUse.profile);
    
    RouterUser.get("/configuracion", conRem.unreadNotifications, conUse.getConfiguration);
    
    RouterUser.get("/notificaciones", conRem.unreadNotifications, conRem.getReminders);

    // --- Peticiones POST ---
    RouterUser.post("/guardarConfiguracion",
        // Campos de enums válidos
        check("font_size", "31").custom((fontS) => {
        return (fontS === "grande" || fontS === "normal")
        }),
        check("theme", "32").custom((theme) => {
        return (theme === "alegre" || theme === "minimalista")
        }),
        check("time_preference", "33").custom((timeP) => {
        return (timeP === "corto" || timeP === "largo")
        }),
        conRem.unreadNotifications,
        conUse.updateConfiguration);

}

module.exports = {
    RouterUser: RouterUser,
    routerConfig: routerConfig
};