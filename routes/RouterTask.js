"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");
const { check, validationResult } = require("express-validator");

// --- Crear router ---
const RouterTask = express.Router();

// Obtener pool
function routerConfig(conTarea) {

    // --- Peticiones GET ---
    // Crear Tarea
    RouterTask.get("/crearTarea", conTarea.datosForm, conTarea.getFormTask);

    // Mostrar una tarea
    RouterTask.get(
        "/tarea/:id",
        check("id", "-2").isNumeric(),
        conTarea.datosForm,
        conTarea.getTask);

    // --- Peticiones POST ---
    // Crear Tarea 
    RouterTask.post("/crearTareaForm",
        // Ninguno de los campos vacíos 
        check("titulo", "1").notEmpty(),
        check("id", "1").notEmpty(),
        check("fecha", "1").notEmpty(),
        check("hora", "1").notEmpty(),
        check("categoria", "1").notEmpty(),
        check("recordatorios", "1").notEmpty(),
        check("recompensa", "1").notEmpty(),
        check("duracion", "1").notEmpty(),
        // Campos de enums válidos
        check("recordatorios", "32").custom((recType) => {
        return (recType === "1 día antes" || recType === "Desde 2 días antes" || recType === "Desde 1 semana antes" || recType === "No recordarmelo")
        }),
        check("duracion", "32").custom((durType) => {
        return (durType === "no lo sé" || durType === "corta" || durType === "media" || durType === "larga")
        }),
        conTarea.datosForm,
        conTarea.crearTarea);
}

module.exports = {
    RouterTask: RouterTask,
    routerConfig: routerConfig
};