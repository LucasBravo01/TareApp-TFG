"use strict"

const utils = require("../utils");

class DAOReminder {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushReminderSystem = this.pushReminderSystem.bind(this);
        this.getNotifications = this.getNotifications.bind(this);
    }

    pushReminderSystem(reminder , callback){        
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO reminder (id_receiver, message,sent_date) VALUES(?,?,?);";
                connection.query(querySQL, [ reminder.id, "A por todo!!!", reminder.sent_date], (error) => {
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

    getNotifications(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM reminder AS REM JOIN subscription AS SUB ON REM.id_receiver = SUB.id_user WHERE id_sender = NULL";
                connection.query(querySQL, (error, rows) => {
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
                                auth: row.auth,
                                p256dh: row.p256dh
                            }
                            reminders.push(reminder);
                        });
                        callback(null, reminders);
                    }
                });
            }
        });
    }

}


module.exports = DAOReminder;