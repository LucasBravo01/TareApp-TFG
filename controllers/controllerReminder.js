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
    constructor(daoRem) {
        this.daoRem = daoRem;

        this.sendNotifications = this.sendNotifications.bind(this);
    }

    sendNotifications() {
        const notificationPayload = {
            notification: {
                title: '¡Recordatorio TareApp!',
                body: '¡Tienes un nuevo mensaje!',
                icon: '../public/images/logos/logo-192x192.png' // Ruta al icono de la notificación
            }
        };
        
        this.daoRem.getNotifications((error, notifications) => {
            if (error) {
            console.error('Error al obtener suscripciones:', err);
            } else {
                notifications.forEach(notification => {
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
        this.daoRem.guardarSuscripcion(subscription, (err) => {
            if (err) {
                console.error('Error al guardar la suscripción:', err);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }
            res.status(200).json({ message: 'Suscripción guardada correctamente' });
        });
    }

}

module.exports = controllerReminder;