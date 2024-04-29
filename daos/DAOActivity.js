"use strict"

class DAOActivity {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readActivityByIdUser = this.readActivityByIdUser.bind(this);
        this.readActivity = this.readActivity.bind(this);
        // INSERTs
        this.insertActivity = this.insertActivity.bind(this);
    }

    // SELECTs
    // Leer actividades dado un id de usuario
    readActivityByIdUser(idUser, callback) {
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

    // Leer actividad repetida
    readActivity(form, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM activity WHERE title = ? AND date = ? AND time = ? AND id_receiver = ?;";
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

    // INSERTs
    // Insertar recordatorio
    insertActivity(form, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO activity (id_creator, id_receiver, title, date, time, description, reminder, category, id_subject) VALUES (?,?,?,?,?,?,?,?,?);";
                connection.query(querySQL, [form.id, form.id, form.title, form.date, form.time, form.description, form.reminders, form.category, form.subject], (error, result) => {
                    connection.release();
                    if (error) {
                        callback(-1);
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
}

module.exports = DAOActivity;
