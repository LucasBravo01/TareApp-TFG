"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");
const { check, validationResult } = require("express-validator");

// --- Crear router ---
const RouterStudySession = express.Router();

// Obtener pool
function routerConfig(conTas, conStu, conRem) {
    // --- Peticiones GET ---
    // Mostrar sesión de estudio
    RouterStudySession.get("/sesionEstudio", conRem.unreadReminders, conTas.getNotCompletedTasks, conStu.getStudySessions);

    // --- Peticiones POST ---
    // Crear sesión de estudio
    RouterStudySession.post("/nuevaSesionEstudio",
        // Ninguno de los campos vacíos 
        check("name", "1").notEmpty(),
        check("study_slot", "1").notEmpty(),
        check("brake_slot", "1").notEmpty(),
        check("num_slots", "1").notEmpty(),
        // Comprobar tipos correctos
        check("study_slot", "1").isNumeric(),
        check("brake_slot", "1").isNumeric(),
        check("num_slots", "1").isNumeric(),
        conRem.unreadReminders, 
        conStu.createStudySession);

    // Marcar tarea como completada
    RouterStudySession.post("/completarTarea",
        check("id", "1").notEmpty(),
        check("checkbox", "4").isNumeric(),
        conTas.markTaskAsCompleted
    );
}

module.exports = {
    RouterStudySession: RouterStudySession,
    routerConfig: routerConfig
};