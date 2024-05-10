"use strict"

// --- Importar módulos ---
// Paquete
const express = require("express");

// --- Crear router ---
const RouterReminder = express.Router();

// Obtener pool
function routerConfig(conRem) {

    // --- Peticiones GET ---
    // Notificaciones
    RouterReminder.get("/notificaciones", conRem.unreadReminders, conRem.getReminders);

    // --- Peticiones POST ---
    // Activar las notificaciones
    RouterReminder.post('/suscribirse', conRem.subscribe);

    // Marcar recordatorios como leidos
    RouterReminder.post("/marcarLeido", conRem.markReminderAsRead);

}

module.exports = {
    RouterReminder: RouterReminder,
    routerConfig: routerConfig
};