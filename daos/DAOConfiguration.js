"use strict"

class DAOConfiguration {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readConfigurationByIdUser = this.readConfigurationByIdUser.bind(this);
        // UPDATEs
        this.updateConfiguration = this.updateConfiguration.bind(this);
    }

    // SELECTs
    // Leer configuración dado un id de usuario
    readConfigurationByIdUser(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM configuration where id_user = ?;";
                connection.query(querySQL, [idUser], (error, rows) => {

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
                            let configuration = {
                                id_user: rows[0].id_user,
                                font_size: rows[0].font_size,
                                theme: rows[0].theme,
                                time_preference: rows[0].time_preference,
                                reward_type:  rows[0].reward_type,
                            }
                            callback(null, configuration);
                        }
                    }
                });
            }
        });
    }

    // UPDATEs
    // Actualizar configuración del usuario
    updateConfiguration(config, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "UPDATE configuration SET font_size = ?, theme = ?, time_preference = ?,reward_type = ? WHERE id_user = ?;";
                connection.query(querySQL, [config.font_size, config.theme, config.time_preference, config.reward ,config.id_user], (error) => {
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

module.exports = DAOConfiguration;