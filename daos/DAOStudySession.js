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
                        let studySessions = new Array();
                        rows.forEach(row => {
                            let studySession = {
                                id: row.id,
                                name: row.name,
                                idUser: row.id_user,
                                studySlot: row.study_slot,
                                brakeSlot: row.brake_slot,
                                longBrakeSlot: row.long_brake_slot,
                                numSlots: row.num_slots,
                                numLongSlots: row.num_long_slots
                            }
                            studySessions.push(studySession);
                        });
                        callback(null, studySessions);
                    }
                });
            }
        });
    }

    // INSERTs
    // Crear una nueva sesión de estudio
    insertStudySession(studySession, callback) {
        this.pool.getConnection((error, connection) => {
            if(error) {
                callback(-1);
            } else {
                let querySQL = "INSERT INTO studysession (name, id_user, study_slot, brake_slot, long_brake_slot, num_slots, num_long_slots) VALUES (?, ?, ?, ?, ?, ?, ?);"
                connection.query(querySQL, [studySession.name, studySession.idUser, studySession.studySlot, studySession.brakeSlot, studySession.longBrakeSlot, studySession.numSlots, studySession.numLongSlots], (error, result) => {
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