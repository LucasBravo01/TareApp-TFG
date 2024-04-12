"use strict"

class DAOSuscripción {
    constructor(pool){
        this.pool = pool;//tener el pool conexion
    }
    
    guardarSuscripcion(subscription, callback) {
        const sql = "INSERT INTO suscripciones (endpoint, auth, p256dh) VALUES (?, ?, ?)";
        const { endpoint, keys } = subscription;
        const values = [endpoint, keys.auth, keys.p256dh];

        this.pool.query(sql, values, (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    }

    getAllSubscriptions(callback) {
        const sql = "SELECT * FROM suscripciones";
        this.pool.query(sql, (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }
            const subscriptions = rows.map(row => {
                return {
                    endpoint: row.endpoint,
                    keys: {
                        auth: row.auth,
                        p256dh: row.p256dh
                    }
                };
            });
            callback(null, subscriptions);
        });
    }
}

module.exports = DAOSuscripción;