"use strict"

class DAOUser {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readUserByUsername = this.readUserByUsername.bind(this);
        this.readUserById = this.readUserById.bind(this);
        this.readPicByIdUser = this.readPicByIdUser.bind(this);
    }

    // SELECTs
    // Leer usuario dado un nombre de usuario
    readUserByUsername(username, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM user WHERE enabled = 1 AND access_user = ?;";
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
                                enabled: rows[0].enabled,
                                username: rows[0].access_user,
                                name: rows[0].first_name,
                                lastname1: rows[0].last_name1,
                                lastname2: rows[0].last_name2,
                                password: rows[0].password,
                                hasProfilePic: (rows[0].photo ? true : false),
                                rol: rows[0].userType,
                                idParent: rows[0].id_parent
                            }
                            callback(null, user);
                        }
                    }
                });
            }
        });
    }

    // Leer usuario dado un id
    readUserById(id, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM user WHERE enabled = 1 AND id = ?;";
                connection.query(querySQL, [id], (error, rows) => {
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
                                enabled: rows[0].enabled,
                                username: rows[0].access_user,
                                name: rows[0].first_name,
                                lastname1: rows[0].last_name1,
                                lastname2: rows[0].last_name2,
                                password: rows[0].password,
                                hasProfilePic: (rows[0].photo ? true : false),
                                rol: rows[0].userType,
                                idParent: rows[0].id_parent
                            }
                            callback(null, user);
                        }
                    }
                });
            }
        });
    }

    // Leer foto dado un id de usuario
    readPicByIdUser(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT photo FROM user WHERE id = ?;";
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
                            let pic = rows[0].photo;
                            callback(null, pic);
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOUser;