"use strict"

const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

class ControllerUser {
    // Constructor
    constructor(daoAct, daoCon, daoRem, daoRew, daoUse) {
        
        this.daoAct = daoAct;
        this.daoCon = daoCon;
        this.daoRem = daoRem;
        this.daoRew = daoRew;
        this.daoUse = daoUse;

        this.profile = this.profile.bind(this);
        this.profilePic = this.profilePic.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getConfiguration = this.getConfiguration.bind(this);
        this.updateConfiguration = this.updateConfiguration.bind(this);
    }
    
    //Metodo para traerme las recompensas del usuario
    profile(req, res, next) {
        this.daoRew.getCountRewardsUser(req.session.currentUser.id, (error, userRewards) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            } else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "profile",
                    data: {
                        response: undefined,
                        generalInfo: {
                            notificationsUnread: req.unreadNotifications
                        },
                        user: req.session.currentUser,
                        userRewards: userRewards
                    }
                });      
            }
        });
    }

    // Obtener foto de perfil de un usuario
    profilePic(request, response, next) {        
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            this.daoUse.readPic(request.params.id, (error, pic) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    next({
                        ajax: true,
                        error: false,
                        img: pic
                    });
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
        }
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
                                        this.daoCon.getConfigurationByUser(req.session.currentUser.id, (error, configuration) => {
                                            if (error) {
                                                errorHandler.manageError(error, {}, "error", next);
                                            }
                                            else {
                                                req.session.currentUser.configuration = configuration;
                                                // Obtener notificaciones no leídas
                                                this.daoRem.notificationsUnread(req.session.currentUser.id, (error, numUnreadNotifications) => {
                                                    if (error) {
                                                        errorHandler.manageError(error, {}, "error", next);
                                                    }
                                                    else {
                                                        next({
                                                            ajax: false,
                                                            status: 200,
                                                            redirect: "tasks",
                                                            data: {
                                                                response: undefined,
                                                                generalInfo: {
                                                                    notificationsUnread: numUnreadNotifications
                                                                },
                                                                tasks: tasks
                                                            }
                                                        });
                                                    }
                                                });
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

    getConfiguration(req, res, next) {
        next({
            ajax: false,
            status: 200,
            redirect: "configuration",
            data: {
                response: undefined,
                generalInfo: {
                    notificationsUnread: req.unreadNotifications
                },
                configuration: req.session.currentUser.configuration
            }
        });
    }

    updateConfiguration(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let form = {
                id_user: req.session.currentUser.id,
                font_size: req.body.font_size,
                theme: req.body.theme,
                time_preference: req.body.time_preference
            }
            this.daoCon.updateConfiguration(form, (error) => {
                if (error) {
                    errorHandler.manageAJAXError(error, next);
                }
                else{
                    req.session.currentUser.configuration = form;
                    next({
                        ajax: true,
                        error: false,
                        img: false,
                        data: { 
                            code: 200,
                            title: "Configuración actualizada con éxito.",
                            message: "Enhorabuena tu configuración ha sido actualizada correctamente."
                        }
                    });
                }
            });
        }                                 
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next); //TODO Mirar que numero poner
        }
    }
}

module.exports = ControllerUser;