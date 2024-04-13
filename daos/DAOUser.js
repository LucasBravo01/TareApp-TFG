"use strict"

class DAOUser {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.readByUser = this.readByUser.bind(this);
        this.readById = this.readById.bind(this);
    }

    // Obtener usuario por nombre
    readByUser(username, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM user WHERE enabled = 1 AND access_user = ?";
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

    // Obtener usuario por id
    readById(id, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM user WHERE enabled = 1 AND id = ?";
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

}

module.exports = DAOUser;