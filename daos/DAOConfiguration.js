"use strict"

class DAOConfiguration {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.updateConfigurations = this.readAllConfigurations.bind(this);
        this.getConfigurationByUser= this.getConfiguration.bind(this);
    }

    getConfigurationByUser(userID, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM configuration AS CONF where CONF.id_user = userID";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let config = new Array();
                        rows.forEach(row => {
                            let category = {
                                id_user: row.id_user,
                                font_size: row.font_size,
                                theme: row.theme,
                                time_preference: row.time_preference
                            }
                            configuration.push(config);
                        });
                        callback(null, configuration);
                    }
                });
            }
        });
    }

    updateConfigurations(config, callback){
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "UPDATE `configuration` SET `font_size`='?',`theme`='?',`time_preference`='?' WHERE id_user = ?;";
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