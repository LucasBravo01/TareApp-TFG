"use strict"

class DAOStudySession {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readStudySessionsByIdUser = this.readStudySessionsByIdUser.bind(this);
    }

    // SELECTs
    // Leer todas las sesiones de estudio de un usuario
    readStudySessionsByIdUser(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            } else {
                let querySQL = "SELECT * FROM studysession WHERE id_user = ?;"
            
                connection.query(querySQL, [idUser], (error, rows) => {
                    connection.release();

                    if (error) {
                        callback(-1);
                    } else {
                        let studysessions = new Array();
                        rows.forEach(row => {
                            let studysession = {
                                id: row.id,
                                name: row.name,
                                id_user: row.id_user,
                                study_slot: row.study_slot,
                                brake_slot: row.brake_slot,
                                long_brake_slot: row.long_brake_slot,
                                num_slots: row.num_slots,
                                num_long_slots: row.num_long_slots
                            }
                            studysessions.push(studysession);
                        });
                        callback(null, studysessions);
                    }
                });
            }
        });
    }
}

module.exports = DAOStudySession;