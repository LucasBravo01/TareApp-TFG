"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");
const { check, validationResult } = require("express-validator");

// --- Crear router ---
const RouterUser = express.Router();

// Obtener pool
function routerConfig(conUse) {

    // --- Peticiones GET ---
    // Perfil usuario
    RouterUser.get("/perfil", conUse.profile);
    
    RouterUser.get("/configuracion", conUse.getConfiguration);

    // --- Peticiones POST ---
    RouterUser.post("/usuario/guardarConfiguracion",

     // Campos de enums válidos
     check("font_size", "32").custom((fontS) => {
        return (fontS === "grande" || fontS === "normal")
        }),
        check("theme", "32").custom((theme) => {
        return (theme === "alegre" || theme === "minimalista")
        }),
        check("time_preference", "32").custom((timeP) => {
        return (timeP === "corto" || timeP === "largo")
        }),
        conUse.updateConfiguration);

}

module.exports = {
    RouterUser: RouterUser,
    routerConfig: routerConfig
};