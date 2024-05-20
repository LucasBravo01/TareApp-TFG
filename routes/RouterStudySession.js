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
        check("studySlot", "1").notEmpty(),
        check("breakSlot", "1").notEmpty(),
        check("numSlots", "1").notEmpty(),
        // Comprobar tipos correctos
        check("studySlot", "16").isNumeric(),
        check("breakSlot", "16").isNumeric(),
        check("numSlots", "16").isNumeric(),
        // Duración mayor a 0
        check("studySlot", "19").custom((duration) => {
            return (duration > 0)
        }),
        // Duración mayor a 0
        check("breakSlot", "19").custom((duration) => {
            return (duration > 0)
        }),
        conRem.unreadReminders, 
        conStu.createStudySession);
}

module.exports = {
    RouterStudySession: RouterStudySession,
    routerConfig: routerConfig
};