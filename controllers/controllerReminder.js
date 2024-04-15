"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

// --- Web-Push ---
const webpush = require('web-push'); // Importar web-push
// Configuración de web-push (debes configurar tus propias claves)
// Configura tus propias claves VAPID
// const vapidKeys = webpush.generateVAPIDKeys();
const publicVapidKey = 'BLCnzXg8xUoWfMEHgv6LvbweKvD8gPFnhDFa_itdDK-k7UvZhthfW9KyIRopraMi5mhaXqEMXitX22g-4kJNs7g';
const privateVapidKey = 'RQL25CNQAqpZHFJuCVKmP2kpDpeuRKZhNbK-N1Ijouc';
webpush.setVapidDetails('mailto:your_email@example.com', publicVapidKey, privateVapidKey);

class controllerReminder {
    // Constructor
    constructor(daoRem, daoSubs) {
        this.daoRem = daoRem;
        this.daoSubs = daoSubs;

        this.sendNotifications = this.sendNotifications.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.getReminders = this.getReminders.bind(this);
    }

    sendNotifications() {
        const notificationPayload = {
            notification: {
                title: 'TareApp',
                icon: '/images/logos/logo-192x192.png' // Ruta al icono de la notificación
            }
        };
        
        let currentDate = new Date();
        currentDate.setHours(8, 0, 0, 0);


        this.daoRem.getNotifications(currentDate, (error, notifications) => {
            if (error) {
            console.error('Error al obtener suscripciones:', err);
            } else {
                notifications.forEach(notification => {
                    notificationPayload.notification.body = notification.message;
                    if(notification.endpoint) {
                        webpush.sendNotification(notification, JSON.stringify(notificationPayload))
                    .then(() => console.log('Notificación enviada con éxito a', notification.endpoint))
                    .catch(err => console.error('Error al enviar notificación a', notification.endpoint, ':', err));
                    }
                });
            }
        });
    }

    subscribe(req, res, next) {
        const subscription = req.body.subscription;
        this.daoSubs.pushSubscription(req.session.currentUser.id, subscription, (error) => {
            if (error) {
                console.error('Error al guardar la suscripción:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }
            res.status(200).json({ message: 'Suscripción guardada correctamente' });
        });
    }

    getReminders(req, res, next) {
        let currentDate = new Date();
        this.daoRem.readAllByUser(req.session.currentUser.id,currentDate, (error, reminders) => {
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
                        generalInfo: {},
                        reminders: reminders
                    }
                });
            }
        });
    }

}

module.exports = controllerReminder;