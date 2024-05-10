"use strict"

class DAOStudySession {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readStudySessionsByIdUser = this.readStudySessionsByIdUser.bind(this);
        // INSERTs
        this.insertStudySession = this.insertStudySession.bind(this);
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

    // INSERTs
    // Crear una nueva sesión de estudio
    insertStudySession(studysession, callback) {
        this.pool.getConnection((error, connection) => {
            if(error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO studysessions (name, id_user, study_slot, brake_slot, long_brake_slot, num_slots, num_long_slots) VALUES (?, ?, ?, ?, ?, ?, ?);"
                connection.query(querySQL, [studysession.name, studysession.id_user, studysession.study_slot, studysession.brake_slot, studysession.long_brake_slot, studysession.num_slots, studysession.num_long_slots], (error, result) => {
                    connection.release();
                    if(error) {
                        callback(-1);
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

}

module.exports = DAOStudySession;