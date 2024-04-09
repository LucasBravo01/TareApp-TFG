"use strict"

class DAORecompensa {
    // Constructor con las conexiones
    constructor (pool) {
        this.pool = pool;
    }

    readAllRecompensas (callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(-1);
            }
            else {
                connection.query("SELECT * FROM recompensa", function(err, rows) {
                    connection.release();

                    if (err) {
                        callback(-1);
                    }
                    else {
                        let recompensas =  [];
                        let id; let titulo; let icono; let mensaje;

                        rows.forEach(element => {
                            id = element.id;
                            titulo = element.titulo;
                            icono = element.icono;
                            mensaje = element.mensaje;

                            recompensas.push({id, titulo, icono, mensaje});
                        });

                        callback(null, recompensas);
                    }
                });
            }
        });
    }

    // Listar recompensas para crear tarea
    readAllRecompensasCrearTarea (callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(-1);
            }
            else {
                connection.query("SELECT id, titulo FROM recompensa", function(err, rows) {
                    connection.release();

                    if (err) {
                        callback(-1);
                    }
                    else {
                        let recompensas =  [];
                        let id; let titulo;

                        rows.forEach(element => {
                            id = element.id;
                            titulo = element.titulo;

                            recompensas.push({id, titulo, icono, mensaje});
                        });

                        callback(null, recompensas);
                    }
                });
            }
        });
    }
}

module.exports = DAORecompensa;