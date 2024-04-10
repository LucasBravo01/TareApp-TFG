"use strict"

class DAOActividad {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.pushActividad = this.pushActividad.bind(this);
        this.readAllByUser = this.readAllByUser.bind(this);
    }

    pushActividad(formulario, callback){
        this.pool.getConnection(function (err, connection) { // coger la conexion
            if (err) {
                callback(new Error("Error de conexión a la base de datos."));// error de conexion
            } else { 
                connection.query("INSERT into actividad (activo, id_creador, id_destinatario, título, fecha, hora, descripción, foto, categoría, id_asignatura, recordatorio)  VALUES(?,?,?,?,?,?,?,?,?,?,?) ",
                    [1, 123, 456, formulario.titulo, formulario.fecha, formulario.horaInicio, formulario.descripcion, undefined, formulario.categoria, formulario.asignatura, formulario.recordatorios],  // Actualiza esta línea
                    function (err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos.")); // Error en la sentencia
                        } else {
                            let actividad = {
                                id : result.insertId, // Aquí obtenemos el ID generado automáticamente
                                duracion : formulario.duracion
                            };
                            callback(null, actividad);  //Devolver el usuario registrado
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
}

module.exports = DAOActividad;