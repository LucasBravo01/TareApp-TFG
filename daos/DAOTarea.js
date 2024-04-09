"use strict"

class DAOTarea {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushTarea = this.pushTarea.bind(this);
    }

    pushTarea(actividad , callback){        
        this.pool.getConnection(function (err, connection) { // coger la conexion
            if (err) {
                callback(new Error("Error de conexión a la base de datos."));// error de conexion
            } else { 
                connection.query("INSERT into tarea (id_actividad, terminada, duracion, id_evento) VALUES(?,?,?,?) ",
                    [ actividad.id, 0, actividad.duracion, undefined],  // Actualiza esta línea
                    function (err) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos.")); // Error en la sentencia
                        } else {
                            callback(null, true);  //Devolver el usuario registrado
                        }
                    }
                );
            }
        });
    }

    readAll(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM tarea";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let tareas = new Array();
                        rows.forEach(row => {
                            let facility = {
                                id: row.id,
                                id_actividad: id_actividad,
                                terminada: row.terminada,
                                duracion: row.duracion,
                                id_evento: row.id_evento,
                            }
                            tareas.push(facility);
                        });
                        callback(null, tareas);
                    }
                });
            }
        });
    }

}

module.exports = DAOTarea;