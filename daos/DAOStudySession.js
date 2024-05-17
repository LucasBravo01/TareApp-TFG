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
                                idUser: row.id_user,
                                studySlot: row.study_slot,
                                brakeSlot: row.brake_slot,
                                longBrakeSlot: row.long_brake_slot,
                                numSlots: row.num_slots,
                                numLongSlots: row.num_long_slots
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
                let querySQL = "INSERT INTO studysession (name, id_user, study_slot, brake_slot, long_brake_slot, num_slots, num_long_slots) VALUES (?, ?, ?, ?, ?, ?, ?);"
                connection.query(querySQL, [studysession.name, studysession.idUser, studysession.studySlot, studysession.brakeSlot, studysession.longBrakeSlot, studysession.numSlots, studysession.numLongSlots], (error, result) => {
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