"use strict"

const errorHandler = require("../errorHandler");

// --- Web-Push ---
const webpush = require('web-push'); // Importar web-push
// Genera tus propias claves VAPID
// const vapidKeys = webpush.generateVAPIDKeys();
const publicVapidKey = 'BLCnzXg8xUoWfMEHgv6LvbweKvD8gPFnhDFa_itdDK-k7UvZhthfW9KyIRopraMi5mhaXqEMXitX22g-4kJNs7g';
const privateVapidKey = 'RQL25CNQAqpZHFJuCVKmP2kpDpeuRKZhNbK-N1Ijouc';
webpush.setVapidDetails('mailto:your_email@example.com', publicVapidKey, privateVapidKey);

class controllerReminder {
    // Constructor
    constructor(daoRem, daoSubs) {
        this.daoRem = daoRem;
        this.daoSubs = daoSubs;

        // GETs
        this.getReminders = this.getReminders.bind(this);
        // POSTs
        this.subscribe = this.subscribe.bind(this);
        this.markReminderAsRead = this.markReminderAsRead.bind(this);
        // OTROS
        this.unreadReminders = this.unreadReminders.bind(this);
        // PROPIAS
        this.sendNotifications = this.sendNotifications.bind(this);
    }

    // GETs
    // Cargar vista de notificaciones
    getReminders(req, res, next) {
        this.daoRem.readRemindersByIdUser(req.session.currentUser.id, (error, reminders) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "notifications",
                    data: {
                        response: undefined,
                        generalInfo: {
                            remindersUnread: req.unreadReminders
                        },
                        reminders: reminders
                    }
                });
            }
        });
    }

    // POSTs
    // Activar las notificaciones
    subscribe(req, res, next) { // TODO Revisar otras opciones
        const subscription = req.body.subscription;
        this.daoSubs.insertSubscription(req.session.currentUser.id, subscription, (error) => {
            if (error) {
                console.error('Error al guardar la suscripción:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }
            res.status(200).json({ message: 'Suscripción guardada correctamente' });
        });
    }

    // Marcar como leído
    markReminderAsRead(req, res, next) {
        this.daoRem.markReminderAsRead(req.session.currentUser.id, (error) => {
            if (error) {
                errorHandler.manageAJAXError(error, next);
            }
            else {
                next({
                    ajax: true,
                    error: false,
                    img: false,
                    data: {}
                });
            }
        });
    }

    // OTROS
    // Obtener mensajes no leídos (y meterlos en req para otros middlewares)
    unreadReminders(req, res, next) {
        // Obtener notificaciones no leídas
        this.daoRem.unreadReminders(req.session.currentUser.id, (error, numUnreadReminders) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                req.unreadReminders = numUnreadReminders;
                next();
            }
        });
    }

    // PROPIAS
    // Mandar las notificaciones a los usuarios
    sendNotifications() {
        const notificationPayload = {
            notification: {
                title: 'TareApp',
                icon: '/images/logos/logo-192x192.png' // Ruta al icono de la notificación
            }
        };

        let currentDate = new Date();
        currentDate.setHours(8, 0, 0, 0);


        this.daoRem.readRemindersByDate(currentDate, (error, notifications) => {
            if (error) {
                console.error('Error al obtener suscripciones:', error);
            } else {
                notifications.forEach(notification => {
                    notificationPayload.notification.body = notification.message;
                    if (notification.endpoint) {
                        webpush.sendNotification(notification, JSON.stringify(notificationPayload))
                            .then(() => console.log('Notificación enviada con éxito a', notification.endpoint))
                            .catch(error => console.error('Error al enviar notificación a', notification.endpoint, ':', error));
                    }
                });
            }
        });
    }

}

module.exports = controllerReminder;