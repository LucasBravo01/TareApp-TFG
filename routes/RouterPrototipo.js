"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");

// --- Crear router ---
const RouterPrototipo = express.Router();

// Obtener pool
function routerConfig(conPro) {

    // --- Peticiones GET ---
    RouterPrototipo.get('/obtener-tareas', conPro.getAllTareas);
    
    // --- Peticiones POST ---
    RouterPrototipo.post('/guardar-tarea', conPro.createTarea);
}

module.exports = {
    RouterPrototipo: RouterPrototipo,
    routerConfig: routerConfig
};