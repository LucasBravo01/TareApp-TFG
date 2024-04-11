"use strict"

class DAOCategoria {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.readAll = this.readAll.bind(this);
        this.checkCategoriaExists = this.checkCategoriaExists.bind(this);
    }

    readAll(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM categoria AS CAT";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let categorias = new Array();
                        rows.forEach(row => {
                            let facility = {
                                nombre: row.nombre,
                                icono: row.icono
                            }
                            categorias.push(facility);
                        });
                        callback(null, categorias);
                    }
                });
            }
        });
    }

    checkCategoriaExists(nombreCategoria, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM categoria WHERE nombre = ?";
                connection.query(querySQL, [nombreCategoria], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows[0].count > 0) {
                            callback(null, true); // La categoría existe
                        }
                        else {
                            callback(null, false); // La categoría no existe
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOCategoria;