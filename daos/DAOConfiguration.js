"use strict"

class DAOConfiguration {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.getConfigurationByUser = this.getConfigurationByUser.bind(this);
        this.updateConfiguration= this.updateConfiguration.bind(this);
    }

    getConfigurationByUser(userID, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM configuration where id_user = ?";
                connection.query(querySQL, [userID], (error, rows) => {

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
                                time_preference: rows[0].time_preference
                            }
                            callback(null, configuration);
                        }
                    }
                });
            }
        });
    }

    updateConfiguration(config, callback){
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "UPDATE configuration SET font_size = ?, theme = ?, time_preference = ? WHERE id_user = ?;";
                connection.query(querySQL, [config.font_size, config.theme, config.time_preference, config.id_user], (error) => {
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

module.exports = DAOConfiguration;