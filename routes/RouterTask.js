"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");
const { check, validationResult } = require("express-validator");

// --- Crear router ---
const RouterTask = express.Router();

// Obtener pool
function routerConfig(conTask) {

    // --- Peticiones GET ---
    // Crear Tarea
    RouterTask.get("/createTask", conTask.dataForm, conTask.getFormTask);

    // Mostrar una tarea
    RouterTask.get(
        "/task/:id",
        check("id", "-2").isNumeric(),
        conTask.dataForm,
        conTask.getTask);

    // --- Peticiones POST ---
    // Crear Tarea 
    RouterTask.post("/createTaskForm",
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
        check("reminders", "32").custom((recType) => {
        return (recType === "1 día antes" || recType === "Desde 2 días antes" || recType === "Desde 1 semana antes" || recType === "No recordarmelo")
        }),
        check("duration", "32").custom((durType) => {
        return (durType === "no lo sé" || durType === "corta" || durType === "media" || durType === "larga")
        }),
        conTask.dataForm,
        conTask.createTask);
}

module.exports = {
    RouterTask: RouterTask,
    routerConfig: routerConfig
};