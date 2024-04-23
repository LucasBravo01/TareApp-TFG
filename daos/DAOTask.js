"use strict"

const utils = require("../utils");

class DAOTask {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushTask = this.pushTask.bind(this);
        this.getTaskById = this.getTaskById.bind(this);
        this.readAllByUserAndWeek = this.readAllByUserAndWeek.bind(this);
        this.readAllByUserAndDay = this.readAllByUserAndDay.bind(this);
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

    readAllByUserAndWeek(userId, startOfWeek, endOfWeek, callback) {
        const sql = `
            SELECT a.*, t.*
            FROM activity a
            JOIN task t ON a.id = t.id_activity
            WHERE (a.id_creator = ? OR a.id_receiver = ?)
            AND a.date BETWEEN ? AND ?
            AND a.enabled = 1
            ORDER BY a.date, a.time;
        `;
        this.pool.query(sql, [userId, userId, startOfWeek, endOfWeek], function(err, tasks) {
            if (err) {
                console.error("SQL error:", err);
                callback(err, null);
            } else {
                console.log("Tasks retrieved:", tasks);
                callback(null, tasks);
            }
        });
    }

    readAllByUserAndDay(userId, startOfDay, callback) {
        const sql = `
            SELECT a.*, t.*
            FROM activity a
            JOIN task t ON a.id = t.id_activity
            WHERE (a.id_creator = ? OR a.id_receiver = ?)
            AND DATE(a.date) = DATE(?) 
            AND a.enabled = 1
            ORDER BY a.time; 
        `;
        this.pool.query(sql, [userId, userId, startOfDay], function(err, tasks) {
            if (err) {
                console.error("SQL error:", err);
                callback(err, null);
            } else {
                console.log("Tasks retrieved:", tasks);
                callback(null, tasks);
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