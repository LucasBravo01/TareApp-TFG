"use strict"

const utils = require("../utils");

class DAOReminder {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushReminderSystem = this.pushReminderSystem.bind(this);
        this.getNotifications = this.getNotifications.bind(this);
        this.readAllByUser = this.readAllByUser.bind(this);
        this.notificationsUnread = this.notificationsUnread.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
    }

    pushReminderSystem(reminder, username, callback){        
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO reminder (id_receiver, message,sent_date) VALUES(?,?,?);";
                connection.query(querySQL, [ reminder.id, `¡A por todo ${username}!`, reminder.sent_date], (error) => {
                    connection.release();
                    if (error) {
                        callback(-1); // Error en la sentencia
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    getNotifications(date, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM reminder AS REM JOIN subscription AS SUB ON REM.id_receiver = SUB.id_user WHERE REM.sent_date=? AND REM.id_sender IS NULL ORDER BY REM.id_receiver;"; // TODO GROUP BY para mandar solo una. Hablar con el grupo
                connection.query(querySQL, [date], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let reminders = new Array();
                        rows.forEach(row => {
                            let reminder = {
                                message: row.message,
                                endpoint: row.endpoint,
                                keys: {
                                    auth: row.auth,
                                    p256dh: row.p256dh
                                }                                
                            }
                            reminders.push(reminder);
                        });
                        callback(null, reminders);
                    }
                });
            }
        });
    }

    readAllByUser(id,date, callback){
        let today = new Date(); 
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {

                let querySQL = "SELECT * FROM reminder AS REM where  REM.id_receiver = ? AND REM.sent_date <= ?;";
                connection.query(querySQL, [id,today], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let reminders = new Array();
                        rows.forEach(row => {
                            let reminder = {
                                message: row.message,                            
                            }
                            reminders.push(reminder);
                        });
                        callback(null, reminders);
                    }
                });
            }
        });
    }

    // Número de notificaciones no leidas
    notificationsUnread(idUser, today ,callback) { // TODO solo aquellos anteriores a la fecha actual
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS unread FROM reminder AS REM WHERE id_receiver = ? AND sent_date <= ? AND read_date IS NULL;";
                connection.query(querySQL, [idUser, today], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length != 1) {
                            callback(-1);
                        }
                        else {
                            let numUnreadNotifications = rows[0].unread
                            callback(null, numUnreadNotifications);
                        }
                    }
                });
            }
        });
    }

    // Número de mensajes no leidos
    markAsRead(today, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "UPDATE reminder SET read_date = CURRENT_TIMESTAMP WHERE sent_date <= ?";
                connection.query(querySQL, [today], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.affectedRows != 1) {
                            callback(-1);
                        }
                        else {
                            callback(null);
                        }
                    }
                });
            }
        });
    }
}


module.exports = DAOReminder;