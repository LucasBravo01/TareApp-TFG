"use strict"

class DAOReward {
    // Constructor con las conexiones
    constructor (pool) {
        this.pool = pool;

       
        this.getRewardsUser = this.getRewardsUser.bind(this);
        this.readAllRewards = this.readAllRewards.bind(this);
        this.checkRewardsExists = this.checkRewardExists.bind(this);
    }

    // Leer todas las recompensas de la base de datos
    readAllRewards (callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(-1);
            }
            else {
                connection.query("SELECT * FROM reward", function(err, rows) {
                    connection.release();

                    if (err) {
                        callback(-1);
                    }
                    else {
                        let rewards =  [];
                        let id; let title; let icon; let message;

                        rows.forEach(element => {
                            id = element.id;
                            title = element.title;
                            icon = element.icon;
                            message = element.message;

                            rewards.push({id, title, icon, message});
                        });

                        callback(null, rewards);
                    }
                });
            }
        });
    }

    // Obtener las recompensas de un usuario tras haber completado una tarea
    getRewardsUser(idUser, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(-1);
            } else {
                let querySQL = "SELECT REW.* FROM reward AS REW JOIN task AS TAS ON TAS.id_reward = REW.id JOIN activity AS ACT ON ACT.id = TAS.id_activity WHERE TAS.completed = 1 AND ACT.id_receiver = ?;";
                
                connection.query(querySQL, [idUser], (err, rows) => {
                    connection.release();
    
                    if (err) {
                        callback(-1);
                    } else {
                        let rewards = [];
                        let id, title, icon, message;
    
                        rows.forEach(element => {
                            id = element.id;
                            title = element.titulo;
                            icon = element.icono;
                            message = element.mensaje;
    
                            rewards.push({ id, title, icon, message });
                        });
    
                        callback(null, rewards);
                    }
                });
            }
        });
    }

    //Verificar que una recompensa existe en la BBDD
    checkRewardExists(idReward, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM reward WHERE id = ?";
                connection.query(querySQL, [idReward], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows[0].count > 0) {
                            callback(null, true); // La asignatura existe
                        }
                        else {
                            callback(null, false); // La asignatura no existe
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOReward;