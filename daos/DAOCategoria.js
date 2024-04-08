"use strict"

class DAOCategoria {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.readAll = this.readAll.bind(this);
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
}

module.exports = DAOCategoria;