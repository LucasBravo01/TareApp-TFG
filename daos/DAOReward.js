"use strict"

class DAOReward {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readAllRewards = this.readAllRewards.bind(this);
        this.readRewardsByIdUser = this.readRewardsByIdUser.bind(this);
        this.readRewardsById = this.readRewardsById.bind(this);
        this.readRewardsByTask = this.readRewardsByTask.bind(this);
    }

    // SELECTs
    // Leer todas las recompensas
    readAllRewards(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "SELECT * FROM reward;";

                connection.query(querySQL, (error, rows) => {
                    connection.release();

                    if (error) {
                        callback(-1);
                    } else {
                        let rewards = new Array();
                        rows.forEach(row => {
                            let reward = {
                                id: row.id,
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

    // Leer recompensas dado un id de usuario
    readRewardsByIdUser(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "SELECT REW.*, COUNT(*) as count FROM reward AS REW LEFT JOIN task AS TAS ON TAS.id_reward = REW.id LEFT JOIN activity AS ACT ON ACT.id = TAS.id_activity WHERE TAS.completed = 1 AND ACT.id_receiver = ? GROUP BY REW.id;";

                connection.query(querySQL, [idUser], (error, rows) => {
                    connection.release();

                    if (error) {
                        callback(-1);
                    } else {
                        let rewards = new Array();
                        rows.forEach(row => {
                            let reward = {
                                id: row.id,
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

    // Leer número de recompensas dado un id
    readRewardsById(idReward, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM reward WHERE id = ?;";
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

    // Leer recompensas dado un id de recompensa de una tarea
    readRewardsByTask(idReward, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "SELECT * FROM reward where id = ?;";
                connection.query(querySQL, [idReward], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    } else { 
                        let reward = {
                            message: rows[0].message,
                            icon: rows[0].icon,
                        }   
                        callback(null, reward);
                    }
                }); 
            }
        });
    } 
}

module.exports = DAOReward;