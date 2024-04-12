"use strict"

class DAORecompensa {
    // Constructor con las conexiones
    constructor (pool) {
        this.pool = pool;

       
        this.getRecompensasUsuario = this.getRecompensasUsuario.bind(this);
        this.readAllRecompensas = this.readAllRecompensas.bind(this);
        this.readAllRecompensasCrearTarea = this.readAllRecompensasCrearTarea.bind(this);
        this.checkRecompensaExists = this.checkRecompensaExists.bind(this);
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
                            titulo = element.título;
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
                connection.query("SELECT id, título FROM recompensa", function(err, rows) {
                    connection.release();

                    if (err) {
                        callback(-1);
                    }
                    else {
                        let recompensas =  [];
                        let id; let titulo;

                        rows.forEach(element => {
                            id = element.id;
                            titulo = element.título;

                            recompensas.push({id, titulo});
                        });

                        callback(null, recompensas);
                    }
                });
            }
        });
    }

    // Obtener las recompensas de un usuario tras haber completado una tarea
    // Obtener las recompensas de un usuario tras haber completado una tarea
    getRecompensasUsuario(idUser, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(-1);
            } else {
                let querySQL = "SELECT REC.* FROM recompensa AS REC JOIN tarea AS TAR ON TAR.id_recompensa = REC.id JOIN actividad AS ACT ON ACT.id = TAR.id_actividad WHERE TAR.terminada = 1 AND ACT.id_creador = ?;";
                
                connection.query(querySQL, [idUser], (err, rows) => {
                    connection.release();
    
                    if (err) {
                        callback(-1);
                    } else {
                        let recompensas = [];
                        let id, titulo, icono, mensaje;
    
                        rows.forEach(element => {
                            id = element.id;
                            titulo = element.titulo;
                            icono = element.icono;
                            mensaje = element.mensaje;
    
                            recompensas.push({ id, titulo, icono, mensaje });
                        });
    
                        callback(null, recompensas);
                    }
                });
            }
        });
    }

    //Verificar que una recompensa existe en la BBDD
    checkRecompensaExists(idRecompensa, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM recompensa WHERE id = ?";
                connection.query(querySQL, [idRecompensa], (error, rows) => {
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

module.exports = DAORecompensa;