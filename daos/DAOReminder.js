"use strict"

class DAOReminder {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readRemindersByDate = this.readRemindersByDate.bind(this);
        this.readRemindersByIdUser = this.readRemindersByIdUser.bind(this);
        this.unreadReminders = this.unreadReminders.bind(this);
        // INSERTs
        this.insertReminder = this.insertReminder.bind(this);
        // UPDATEs
        this.markReminderAsRead = this.markReminderAsRead.bind(this);
        this.updateReminders = this.updateReminders.bind(this);
        this.deleteRemindersByTaskId = this.deleteRemindersByTaskId.bind(this);
    }

    // SELECTs
    // Leer recordatorios dada una fecha
    readRemindersByDate(date, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM reminder AS REM JOIN subscription AS SUB ON REM.id_receiver = SUB.id_user WHERE REM.enabled = 1 AND REM.sent_date=? AND REM.id_sender IS NULL ORDER BY REM.id_receiver;";
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

    // Leer recordatorios dado un id de usuario
    readRemindersByIdUser(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {

                let querySQL = "SELECT * FROM reminder AS REM WHERE REM.enabled = 1 AND REM.id_receiver = ? AND REM.sent_date <= CURRENT_TIMESTAMP ORDER BY sent_date desc;";
                connection.query(querySQL, [idUser], (error, rows) => {
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
                                idActivity: row.id_activity,
                                sentDate: row.sent_date
                            }
                            reminders.push(reminder);
                        });
                        callback(null, reminders);
                    }
                });
            }
        });
    }

    // Número de recordatorios no leidas
    unreadReminders(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS unread FROM reminder WHERE enabled = 1 AND id_receiver = ? AND sent_date <= CURRENT_TIMESTAMP AND read_date IS NULL;";
                connection.query(querySQL, [idUser], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length != 1) {
                            callback(-1);
                        }
                        else {
                            let numUnreadReminders = rows[0].unread
                            callback(null, numUnreadReminders);
                        }
                    }
                });
            }
        });
    }
    
    // INSERTs
    // Insertar recordatorio
    insertReminder(reminder, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO reminder (id_receiver, message, sent_date, id_activity) VALUES (?,?,?,?);";
                connection.query(querySQL, [reminder.id, reminder.message, reminder.sentDate, reminder.idActivity], (error) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    // UPDATEs
    // Marcar recordatorios como leidos
    markReminderAsRead(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "UPDATE reminder SET read_date = CURRENT_TIMESTAMP WHERE enabled = 1 AND id_receiver = ? AND sent_date <= CURRENT_TIMESTAMP;";
                connection.query(querySQL, [idUser], (error) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }

    // Activar/Desactivar recordatorios
    updateReminders(idTask, checked, callback) {
        checked = checked ? 0 : 1;
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "UPDATE reminder SET enabled = ? WHERE id_activity = ? AND sent_date >= CURRENT_TIMESTAMP;";
                connection.query(querySQL, [checked, idTask], (error) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }

    //Borrar Recordatorios
    deleteRemindersByTaskId(idTask, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "DELETE FROM reminder WHERE id_activity = ?;";
                connection.query(querySQL, [idTask], (error) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }
    
}


module.exports = DAOReminder;