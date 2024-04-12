"use strict"

class DAOActividad {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushActividad = this.pushActividad.bind(this);
        this.readAllByUser = this.readAllByUser.bind(this);
        this.checkActividadExists = this.checkActividadExists.bind(this);
    }

    pushActividad(formulario, callback){
        this.pool.getConnection(function (err, connection) { // coger la conexion
            if (err) {
                console.log('Error de conexión a la base de datos.');
                callback(new Error("Error de conexión a la base de datos."));// error de conexion
            } else { 
                connection.query("INSERT INTO activity (id_creator, id_receiver, title, date, time, description, reminder, category, id_subject) VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
                [formulario.id, formulario.id, formulario.titulo, formulario.fecha, formulario.hora, formulario.descripcion, formulario.recordatorios,formulario.categoria, formulario.asignatura], // Actualiza esta línea
                    function (err, result) {
                        connection.release();
                        if (err) {
                            console.log('Error de acceso a la base de datos.');
                            callback(new Error("Error de acceso a la base de datos.")); // Error en la sentencia
                        } else {
                            let tarea = {
                                id : result.insertId, // Aquí obtenemos el ID generado automáticamente
                                duracion : formulario.duracion,
                                recompensa: formulario.recompensa
                            };
                            callback(null, tarea);  //Devolver el usuario registrado
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
                            
                            let actividades = new Array();
                            rows.forEach(row => {
                                let facility = {
                                    id: row.id,
                                    activo: row.enabled,
                                    id_creador: row.id_creator,
                                    id_destinatario: row.id_receiver,
                                    título: row.title,
                                    fecha: row.date,
                                    hora: row.time,
                                    descripción: row.description,
                                    foto: (row.photo ? true : false),
                                    recordatorio: row.reminder,
                                    categoría: row.category,
                                    id_asignatura: row.id_subject,

                                    id_actividad: row.id_activity,
                                    terminada: row.completed,
                                    duracion: row.duration,
                                    id_evento: row.id_event,
                                }
                                actividades.push(facility);
                            });
                            callback(null, actividades);
                        }
                    });
                
            }
        });
    }

    checkActividadExists(formulario, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM activity WHERE title = ? and date = ? and time = ? and id_receiver = ?;";
                connection.query(querySQL, [formulario.titulo, formulario.fecha, formulario.hora, formulario.id], (error, rows) => {
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

module.exports = DAOActividad;
