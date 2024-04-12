"use strict"

class DAOAsignatura {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.readAll = this.readAll.bind(this);
        this.checkAsignaturaExists = this.checkAsignaturaExists.bind(this);
    }

    readAll(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM asignatura AS CAT";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let asignaturas = new Array();
                        rows.forEach(row => {
                            let facility = {
                                id: row.id,
                                activo: row.activo,
                                id_profesor: row.id_profesor,
                                nombre: row.nombre,
                                curso: row.curso,
                                color: row.color, 
                                hasProfilePic: (row.foto ? true : false),
                            }
                            asignaturas.push(facility);
                        });
                        callback(null, asignaturas);
                    }
                });
            }
        });
    }

    checkAsignaturaExists(idAsignatura, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM asignatura WHERE id = ?";
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

module.exports = DAOAsignatura;