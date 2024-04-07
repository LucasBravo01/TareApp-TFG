"use strict"

const utils = require("../utils");

class DAOTask {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.getTaskById = this.getTaskById.bind(this);
    }

    getTaskById(idTask, callback){
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM tarea AS TAR JOIN actividad AS ACT ON TAR.id_actividad=ACT.id WHERE ACT.id = ?";
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
                                enabled: rows[0].activo,
                                idCreator: rows[0].id_creador,
                                idDestination: rows[0].id_destinatario,
                                title: rows[0].título,
                                date: utils.formatDate(rows[0].fecha),
                                time: utils.formatHour(rows[0].hora),
                                description: rows[0].descripción,
                                taskHasPic: rows[0].foto ? true : false,
                                reminder: rows[0].recordatorio,
                                category: rows[0].categoría,
                                idSubject: rows[0].id_asignatura,
                                done: rows[0].terminada,
                                duration: rows[0].duración,
                                idEvent: rows[0].id_evento
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