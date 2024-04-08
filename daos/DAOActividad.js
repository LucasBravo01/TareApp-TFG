"use strict"

class DAOActividad {
    constructor(pool){
        this.pool = pool;//tener el pool conexion
        this.pushActividad = this.pushActividad.bind(this);
    }

    pushActividad(formulario, callback){
        console.log(formulario.id);
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
