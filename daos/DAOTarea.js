"use strict"

class DAOTarea {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.readAll = this.readAll.bind(this);
    }

    pushTarea(formulario, callback){
        console.log(`DAO TArea ${formulario}`)
        callback(null, true);  //Devolver el usuario registrado

        /*this.pool.getConnection(function (err, connection) { // coger la conexion
            if (err) {
                callback(new Error("Error de conexión a la base de datos."));// error de conexion
            } else { 
                connection.query("INSERT into tarea () VALUES(?,?,?,?,?,?,?,?) ",
                    [ ],  // Actualiza esta línea
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
        });*/
    }

    readAll(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM categoria AS CAT";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let categorias = new Array();
                        rows.forEach(row => {
                            let facility = {
                                id: row.id,
                                nombre: row.nombre,
                                icono: row.icono,
                                autor: row.autor,
                                curso: row.curso,
                            }
                            categorias.push(facility);
                        });
                        callback(null, categorias);
                    }
                });
            }
        });
    }
}

module.exports = DAOTarea;