"use strict"

const utils = require("../utils");

class DAOTask {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushTask = this.pushTask.bind(this);
        this.getTaskById = this.getTaskById.bind(this);
    }

    pushTask(task , callback){        
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO task (id_activity, duration, id_reward) VALUES(?,?,?);";
                connection.query(querySQL, [task.id, task.duration, task.reward], (error) => {
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

    getTaskById(idTask, callback){
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM task AS TAR JOIN activity AS ACT ON TAR.id_activity=ACT.id WHERE ACT.id = ?";
                connection.query(querySQL, [idTask], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length != 1) {
                            callback(-1);
                        }
                        else {
                            // Construir objeto
                            let task = {
                                id: rows[0].id,
                                enabled: rows[0].enabled,
                                idCreator: rows[0].id_creator,
                                idDestination: rows[0].id_receiver,
                                title: rows[0].title,
                                date: utils.formatDate(rows[0].date),
                                time: utils.formatHour(rows[0].time),
                                description: rows[0].description,
                                taskHasPic: rows[0].photo ? true : false,
                                reminder: rows[0].reminder,
                                category: rows[0].category,
                                idSubject: rows[0].id_subject,
                                done: rows[0].completed,
                                duration: rows[0].duration,
                                idEvent: rows[0].id_event,
                                idReward: rows[0].id_reward
                            }
                            callback(null, task);
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOTask;