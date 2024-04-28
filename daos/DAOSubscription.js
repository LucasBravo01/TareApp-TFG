"use strict"

class DAOSubscription {
    constructor(pool) {
        this.pool = pool;//tener el pool conexion

        this.pushSubscription = this.pushSubscription.bind(this);
    }

    pushSubscription(idUser, subscription, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO subscription (id_user, endpoint, auth, p256dh) VALUES(?,?,?,?);";
                connection.query(querySQL, [idUser, subscription.endpoint, subscription.keys.auth, subscription.keys.p256dh], (error) => {
                    connection.release();
                    if (error) {
                        callback(-1); // Error en la sentencia
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }
}

module.exports = DAOSubscription;