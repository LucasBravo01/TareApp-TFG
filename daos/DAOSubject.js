"use strict"

class DAOSubject {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.readAllSubjects = this.readAllSubjects.bind(this);
        this.checkSubjectExists = this.checkSubjectExists.bind(this);
    }

    readAllSubjects(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM subject AS SUB";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let subjects = new Array();
                        rows.forEach(row => {
                            let facility = {
                                id: row.id,
                                enable: row.enabled,
                                id_teacher: row.id_teacher,
                                name: row.name,
                                grade: row.grade,
                                color: row.color, 
                                subject_icon: row.subject_icon,
                            }
                            subjects.push(facility);
                        });
                        callback(null, subjects);
                    }
                });
            }
        });
    }

    checkSubjectExists(idAsignatura, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM subject WHERE id = ?";
                connection.query(querySQL, [idAsignatura], (error, rows) => {
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

module.exports = DAOSubject;