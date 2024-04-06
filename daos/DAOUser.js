"use strict"

class DAOUser {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.readByUser = this.readByUser.bind(this);
    }

     // Obtener usuario
     readByUser(username, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM usuario WHERE activo = 1 AND usuario_acceso = ?";
                connection.query(querySQL, [username], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length > 1) {
                            callback(-1);
                        }
                        else if (rows.length === 0) {
                            callback(null, null);
                        }
                        else {
                            // Construir objeto
                            let user = {
                                id: rows[0].id,
                                enabled: rows[0].activo,
                                username: rows[0].usuario_acceso,
                                name: rows[0].nombre,
                                lastname1: rows[0].apellido1,
                                lastname2: rows[0].apellido2,
                                password: rows[0].contraseña,
                                hasProfilePic: (rows[0].foto ? true : false),
                                rol: rows[0].tipoUsuario,
                                idParent: rows[0].id_padre
                            }
                            callback(null, user);                          
                        }
                    }
                });
            }
        });
    }

}

module.exports = DAOUser;