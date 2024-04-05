"use strict"

class DAOActividad {
    constructor(pool){
        this.pool = pool;//tener el pool conexion
        this.pushActividad = this.pushActividad.bind(this);
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
}

module.exports = DAOActividad;
