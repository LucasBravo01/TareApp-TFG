"use strict"

class DAORecompensa {
    // Constructor con las conexiones
    constructor (pool) {
        this.pool = pool;
    }

    // Listar recompensas
    readAllRecompensas (callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión con la Base de Datos"));
            }
            else {
                connection.query("SELECT * FROM recompensa", function(err, rows) {
                    connection.release();

                    if (err) {
                        callback(new Error("Error de acceso a la Base de Datos"));
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
}

module.exports = DAORecompensa;