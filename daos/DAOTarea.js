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
                connection.query("INSERT INTO tarea (id_actividad, terminada, duración, id_evento) VALUES(?,?,?,?) ",
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
}

module.exports = DAOTarea;