"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");
const { check, validationResult } = require("express-validator");

// --- Crear router ---
const RouterStudySession = express.Router();

// Obtener pool
function routerConfig(conStu, conRem) {
    // --- Peticiones GET ---
    // Mostrar sesión de estudio
    RouterStudySession.get("/sesionEstudio", conRem.unreadReminders, conStu.getStudySessions);

    // --- Peticiones POST ---
    // Crear sesión de estudio
    RouterStudySession.post("/nuevaSesionEstudio", conRem.unreadReminders, conStu.createStudySession);
}

module.exports = {
    RouterStudySession: RouterStudySession,
    routerConfig: routerConfig
};