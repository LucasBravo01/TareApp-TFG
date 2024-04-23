"use strict"

class DAOReward {
    // Constructor con las conexiones
    constructor (pool) {
        this.pool = pool;

        this.readAllRewards = this.readAllRewards.bind(this);
        this.getRewardsUser = this.getRewardsUser.bind(this);
        this.getCountRewardsUser = this.getCountRewardsUser.bind(this);
        this.checkRewardsExists = this.checkRewardExists.bind(this);
    }

    // Leer todas las recompensas de la base de datos
    readAllRewards (callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(-1);
            } else {
                let querySQL = "SELECT * FROM reward;";
                
                connection.query(querySQL, (err, rows) => {
                    connection.release();
    
                    if (err) {
                        callback(-1);
                    } else {
                        let rewards = new Array();
                        rows.forEach(row => {
                            let reward = {
                                id: row.id,
                                title: row.title,
                                icon: row.icon,
                                message: row.message
                            }
                            rewards.push(reward);
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
                        let rewards = new Array();
                        rows.forEach(row => {
                            let reward = {
                                id: row.id,
                                title: row.title,
                                icon: row.icon,
                                message: row.message
                            }
                            rewards.push(reward);
                        });
                        callback(null, rewards);
                    }
                });
            }
        });
    }

    // Obtener el número de recompensas de cada tipo de un usuario tras haber completado una tarea
    getCountRewardsUser(idUser, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(-1);
            } else {
                let querySQL = "SELECT REW.*, COUNT(*) as count FROM reward AS REW LEFT JOIN task AS TAS ON TAS.id_reward = REW.id LEFT JOIN activity AS ACT ON ACT.id = TAS.id_activity WHERE TAS.completed = 1 AND ACT.id_receiver = ? GROUP BY REW.id;";
                
                connection.query(querySQL, [idUser], (err, rows) => {
                    connection.release();
    
                    if (err) {
                        callback(-1);
                    } else {
                        let rewards = new Array();
                        rows.forEach(row => {
                            let reward = {
                                id: row.id,
                                title: row.title,
                                message: row.message,
                                icon: row.icon,
                                count: row.count
                            }
                            rewards.push(reward);
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