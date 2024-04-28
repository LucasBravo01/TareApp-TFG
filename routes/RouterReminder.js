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
    RouterReminder.get("/notificaciones", conRem.unreadNotifications, conRem.getReminders);

    // --- Peticiones POST ---
    // Activar las notificaciones
    RouterReminder.post('/suscribirse', conRem.subscribe);

    // Marcar recordatorios como leidos
    RouterReminder.post("/marcarLeido", conRem.markAsRead);

}

module.exports = {
    RouterReminder: RouterReminder,
    routerConfig: routerConfig
};