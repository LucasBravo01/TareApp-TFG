"use strict"

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const errorHandler = require("../errorHandler");

class ControllerUser {
    // Constructor
    constructor(daoUse, daoAct, daoRew) {
        this.daoUse = daoUse;
        this.daoAct = daoAct;
        this.daoRew = daoRew;

        this.profile = this.profile.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    //Metodo para traerme las recompensas del usuario
    profile(req, res, next) {
        // Obtener el usuario actual de la sesión
        const currentUser = req.session.currentUser;

        // Obtener las recompensas del usuario utilizando el DAO de recompensas
        this.daoRew.getRewardsUser(currentUser.id, (error, rewards) => {
            if (error) {
                // Manejar el error, redirigir o mostrar un mensaje de error
                next(error);
            } else {
                // Renderizar la vista del perfil del usuario y pasar los datos del usuario y las recompensas
                res.render("profile", { user: currentUser, rewards: rewards });
            }
        });
    }

    // Iniciar sesión
    login(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Obtener usuario
            this.daoUse.readByUser(req.body.user, (error, user) => {
                if (error) {
                    errorHandler.manageError(error, { user: req.body.user }, "login", next);
                }
                else {
                    if (!user) {
                        errorHandler.manageError(3, { user: req.body.user }, "login", next);
                    }
                    else {
                        // Comprobar contraseña con bcrypt
                        bcrypt.compare(req.body.password, user.password, (err, result) => {
                            if (error) {
                                errorHandler.manageError(error, { user: req.body.user }, "login", next);
                            }
                            else if (!result) {
                                errorHandler.manageError(5, { user: req.body.user }, "login", next);
                            }
                            else {
                                // Quitar contraseña, no se guarda en la sesión
                                delete (user.password);
                                // Iniciar sesión
                                req.session.currentUser = user;
                                this.daoAct.readAllByUser(req.session.currentUser.id, (error, tasks) => {
                                    if (error) {
                                        errorHandler.manageError(error, { user: req.body.user }, "login", next);
                                    }
                                    else {
                                        next({
                                            ajax: false,
                                            status: 200,
                                            redirect: "tasks",
                                            data: {
                                                response: undefined,
                                                generalInfo: {},
                                                tasks: tasks
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }            
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), { user: req.body.user }, "login", next);
        }
    }

    // Cerrar sesión
    logout(request, response, next) {
        request.session.destroy();
        next({
            ajax: false,
            status: 200,
            redirect: "login",
            data: {
                user: "",
                response: undefined
            }
        });
    }
}

module.exports = ControllerUser;