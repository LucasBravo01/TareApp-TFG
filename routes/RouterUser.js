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
    RouterUser.post("/guardarConfiguracion");
}

module.exports = {
    RouterUser: RouterUser,
    routerConfig: routerConfig
};