"use strict"

class DAOActivity {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushActivity = this.pushActivity.bind(this);
        this.readAllByUser = this.readAllByUser.bind(this);
        this.checkActivityExists = this.checkActivityExists.bind(this);
    }

    pushActivity(form, callback){
        this.pool.getConnection(function (err, connection) { // coger la conexion
            if (err) {
                callback(-1);
            } else { 
                connection.query("INSERT INTO activity (id_creator, id_receiver, title, date, time, description, reminder, category, id_subject) VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
                [form.id, form.id, form.title, form.date, form.time, form.description, form.reminders,form.category, form.subject], // Actualiza esta línea
                    function (err, result) {
                        connection.release();
                        if (err) {
                            callback(-1); // Error en la sentencia
                        } else {
                            let task = {
                                id : result.insertId, // Aquí obtenemos el ID generado automáticamente
                                duration : form.duration,
                                reward: form.reward
                            };
                            callback(null, task);  //Devolver el usuario registrado
                        }
                    }
                );
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
                    let querySQL = "SELECT * FROM activity AS ACT JOIN task AS TAR ON ACT.id = TAR.id_activity where id_receiver =?;";
                    connection.query(querySQL,[idUser], (error, rows) => {
                        connection.release();
                        if (error) {
                            callback(-1);
                        }
                        else {
                            
                            let activities = new Array();
                            rows.forEach(row => {
                                let facility = {
                                    id: row.id,
                                    enabled: row.enabled,
                                    id_creator: row.id_creator,
                                    id_receiver: row.id_receiver,
                                    title: row.title,
                                    date: row.date,
                                    time: row.time,
                                    description: row.description,
                                    photo: (row.photo ? true : false),
                                    reminder: row.reminder,
                                    category: row.category,
                                    id_subject: row.id_subject,

                                    id_activity: row.id_activity,
                                    completed: row.completed,
                                    duration: row.duration,
                                    id_event: row.id_event,
                                }
                                activities.push(facility);
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
