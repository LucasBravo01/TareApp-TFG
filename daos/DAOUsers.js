"use strict"

class DAOUsers {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.read = this.read.bind(this);
    }

     // Obtener usuario
     read(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "";
                connection.query(querySQL, [idUser], (error, rows) => {
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
                            let user = {
                                id: rows[0].id,
                                name: rows[0].nombre,
                                lastname1: rows[0].apellido1,
                                lastname2: rows[0].apellido2,
                                mail: rows[0].correo,
                                password: rows[0].contraseña,
                                hasProfilePic: (rows[0].foto ? true : false),
                                rol: rows[0].rol,
                            }
                            callback(null, user);
                        }
                    }
                });
            }
        });
    }

}