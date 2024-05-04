"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");
const { check, validationResult } = require("express-validator");

// --- Crear router ---
const RouterTask = express.Router();

// Obtener pool
function routerConfig(conTas, conRem) {

    // --- Peticiones GET ---
    // Crear Tarea
    RouterTask.get("/crearTarea", conRem.unreadReminders, conTas.dataForm, conTas.getFormTask);

    // Mostrar una tarea
    RouterTask.get("/tarea/:id",
        check("id", "-2").isNumeric(),
        conRem.unreadReminders,
        conTas.dataForm,
        conTas.getTask
    );

    // --- Peticiones POST ---
    // Crear Tarea 
    RouterTask.post("/crearTareaForm",
        // Ninguno de los campos vacíos 
        check("title", "1").notEmpty(),
        check("id", "1").notEmpty(),
        check("date", "1").notEmpty(),
        check("time", "1").notEmpty(),
        check("category", "1").notEmpty(),
        check("reminders", "1").notEmpty(),
        check("reward", "1").notEmpty(),
        check("duration", "1").notEmpty(),
        // Campos de enums válidos
        check("reminders", "2").custom((recType) => {
            return (recType === "10 minutos antes" || recType === "1 hora antes" ||recType === "1 día antes" || recType === "Desde 2 días antes" || recType === "Desde 1 semana antes" || recType === "No recordarmelo")
        }),
        check("duration", "3").custom((durType) => {
            return (durType === "no lo sé" || durType === "corta" || durType === "media" || durType === "larga")
        }),
        conRem.unreadReminders,
        conTas.dataForm,
        conTas.createTask
    );

    // Marcar tarea como completada
    RouterTask.post("/marcarCompletada",
        check("id", "1").notEmpty(),
        check("checkbox", "4").isNumeric(),
        conTas.markTaskAsCompleted
    );
}

module.exports = {
    RouterTask: RouterTask,
    routerConfig: routerConfig
};