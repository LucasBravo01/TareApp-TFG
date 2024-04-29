"use strict"

class DAOSubscription {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // INSERTs
        this.insertSubscription = this.insertSubscription.bind(this);
    }

    // INSERTs
    // Insertar suscripción
    insertSubscription(idUser, subscription, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO subscription (id_user, endpoint, auth, p256dh) VALUES (?,?,?,?);";
                connection.query(querySQL, [idUser, subscription.endpoint, subscription.keys.auth, subscription.keys.p256dh], (error) => {
                    connection.release();
                    if (error) {
                        callback(-1); 
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }
}

module.exports = DAOSubscription;