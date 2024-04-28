"use strict"

class DAOActivity {
    constructor(pool) {
        this.pool = pool;//tener el pool conexion

        this.pushActivity = this.pushActivity.bind(this);
        this.readAllByUser = this.readAllByUser.bind(this);
        this.checkActivityExists = this.checkActivityExists.bind(this);
    }

    pushActivity(form, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO activity (id_creator, id_receiver, title, date, time, description, reminder, category, id_subject) VALUES(?,?,?,?,?,?,?,?,?);";
                connection.query(querySQL, [form.id, form.id, form.title, form.date, form.time, form.description, form.reminders, form.category, form.subject], (error, result) => {
                    connection.release();
                    if (error) {
                        callback(-1); // Error en la sentencia
                    } else {
                        let task = {
                            id: result.insertId, // Aquí obtenemos el ID generado automáticamente
                            duration: form.duration,
                            reward: form.reward
                        };
                        callback(null, task);
                    }
                });
            }
        });
    }

    readAllByUser(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                // Construir objeto 
                let querySQL = "SELECT ACT.*, TAR.*, CAT.category_icon, CAT.category_color, SUB.name, SUB.subject_icon, SUB.subject_color FROM ((activity AS ACT JOIN task AS TAR ON ACT.id = TAR.id_activity) JOIN category AS CAT ON ACT.category = CAT.name) LEFT JOIN subject AS SUB ON ACT.id_subject = SUB.id WHERE id_receiver = ? ORDER BY TAR.completed;"
                connection.query(querySQL, [idUser], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {

                        let activities = new Array();
                        rows.forEach(row => {
                            let activity = {
                                // Activity
                                id: row.id,
                                enabled: row.enabled,
                                id_creator: row.id_creator,
                                id_receiver: row.id_receiver,
                                title: row.title,
                                date: row.date,
                                time: row.time,
                                description: row.description,
                                reminder: row.reminder,
                                category: row.category,
                                id_subject: row.id_subject,

                                // Task
                                id_activity: row.id_activity,
                                completed: row.completed,
                                duration: row.duration,
                                id_event: row.id_event,
                                id_reward: row.id_reward,

                                // Category
                                category_icon: row.category_icon,
                                category_color: row.category_color,

                                // Subject
                                name: row.name,
                                subject_icon: row.subject_icon,
                                subject_color: row.subject_color
                            }
                            activities.push(activity);
                        });
                        callback(null, activities);
                    }
                });

            }
        });
    }

    checkActivityExists(form, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM activity WHERE title = ? and date = ? and time = ? and id_receiver = ?;";
                connection.query(querySQL, [form.title, form.date, form.time, form.id], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows[0].count > 0) {
                            callback(null, false); // La actividad ya existe
                        }
                        else {
                            callback(null, true); // La actividad no existe
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOActivity;
