"use strict"

class DAOTareas {
    constructor(pool){
        this.pool = pool;//tener el pool conexion
    }

    crearTarea(asignatura, fecha, callback){  //funcion que inserta una instalacion
        console.log(`Tema BBDD: ${asignatura}`);
        console.log(`Fecha BBDD: ${fecha}`);
        this.pool.getConnection(function(err, connection){// coger la conexion
            if(err){
                callback(new Error("Error de conexión a la base de datos."));// error de conexion
            }else{
                console.log("Conexión establecida")
                const sql = 'INSERT INTO asignaturas (nombre, fecha) VALUES (?, ?)';

                //Sentencia sql para insertar la nueva instalacion
                connection.query(sql,[asignatura, fecha],
                    function (err) {
                        connection.release();  // cerrar la conexion
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos."));// Error en la sentencia
                        } else {
                            callback(null, true); // Exito en la sentencia y pasamos el mensaje
                        }
                    }
                );
            }
        });
    }

    getAllTareas(callback){ //funcion que devuelve todos los usuarios
        this.pool.getConnection(function(err, connection){ // coger la conexion
            if(err){
                callback(new Error("Error de conexión a la base de datos."));// error de conexion
            }else{
                //Sentencia sql para mostrar todos los usuarios
                connection.query("SELECT asignatura.id as id, asignatura.nombre as nombre, asignatura.fecha as fecha FROM asignaturas asignatura ORDER BY asignatura.id DESC LIMIT 5;", 
                function(err, rows){
                    connection.release();// cerrar la conexion
                    if(err){
                        callback(new Error("Error de acceso a la base de datos."));// Error en la sentencia
                    }else{ // Guardar el resultado de la sentencia en una lista de usuarios
                        let tareas = [];
                        let id ;let nombre;let fecha;
                        rows.forEach(element => {  
                            id = element.id,//Correo del usuario
                            nombre= element.nombre,//Nombre del usuario
                            fecha= element.fecha,//Apellido del usuario
                            tareas.push({ id,nombre, fecha}) //Aniadir usuario a la lista
                        });
                        callback(null, tareas); //Mandar lista de usuarios
                    }
                });
            }
        });
    }

}

module.exports = DAOTareas;