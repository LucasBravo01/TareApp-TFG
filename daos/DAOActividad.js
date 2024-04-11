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
                connection.query("INSERT INTO actividad (activo, id_creador, id_destinatario, título, fecha, hora, descripción, foto, recordatorio, categoría, id_asignatura) VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
                [1, formulario.id, formulario.id, formulario.titulo, formulario.fecha, formulario.hora, formulario.descripcion, undefined, formulario.recordatorios,formulario.categoria, formulario.asignatura], // Actualiza esta línea
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
                    let querySQL = "SELECT * FROM actividad AS ACT JOIN tarea AS TAR ON ACT.id = TAR.id_actividad where id_destinatario =?;";
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
                                    activo: row.activo,
                                    id_creador: row.id_creador,
                                    id_destinatario: row.id_destinatario,
                                    título: row.título,
                                    fecha: row.fecha,
                                    hora: row.hora,
                                    descripción: row.descripción,
                                    foto: (row.foto ? true : false),
                                    recordatorio: row.recordatorio,
                                    categoría: row.categoría,
                                    id_asignatura: row.id_asignatura,

                                    id_actividad: row.id_actividad,
                                    terminada: row.terminada,
                                    duracion: row.duracion,
                                    id_evento: row.id_evento,
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
                let querySQL = "SELECT COUNT(*) AS count FROM actividad WHERE título = ? and fecha = ? and hora = ? and id_destinatario = ?;";
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
