"use strict"

const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");
const utils = require("../utils");

class ControllerUser {
    // Constructor
    constructor(daoAct, daoCon, daoRem, daoRew, daoUse) {
        this.daoAct = daoAct;
        this.daoCon = daoCon;
        this.daoRem = daoRem;
        this.daoRew = daoRew;
        this.daoUse = daoUse;

        // GETs
        this.getProfile = this.getProfile.bind(this);
        this.getConfiguration = this.getConfiguration.bind(this);
        // OTROS GETs
        this.getProfilePic = this.getProfilePic.bind(this);
        // POSTs
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.updateConfiguration = this.updateConfiguration.bind(this);
    }

    // GETs
    // Cargar vista de perfil
    getProfile(req, res, next) {
        this.daoRew.readRewardsByIdUser(req.session.currentUser.id, (error, userRewards) => {
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
                            remindersUnread: req.unreadReminders
                        },
                        user: req.session.currentUser,
                        userRewards: userRewards
                    }
                });
            }
        });
    }

    // Cargar vista de configuración
    getConfiguration(req, res, next) {
        next({
            ajax: false,
            status: 200,
            redirect: "configuration",
            data: {
                response: undefined,
                generalInfo: {
                    remindersUnread: req.unreadReminders
                },
                configuration: req.session.currentUser.configuration
            }
        });
    }

    // OTROS GETs
    // Obtener foto de perfil de un usuario
    getProfilePic(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoUse.readPicByIdUser(req.params.id, (error, pic) => {
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

    // POSTs
    // Iniciar sesión
    login(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Obtener usuario
            this.daoUse.readUserByUsername(req.body.user, (error, user) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    if (!user) {
                        errorHandler.manageError(8, { user: req.body.user }, "login", next);
                    }
                    else {
                        // Comprobar contraseña con bcrypt
                        bcrypt.compare(req.body.password, user.password, (error, result) => {
                            if (error) {
                                errorHandler.manageError(error, {}, "error", next);
                            }
                            else if (!result) {
                                errorHandler.manageError(9, { user: req.body.user }, "login", next);
                            }
                            else {
                                // Quitar contraseña, no se guarda en la sesión
                                delete (user.password);
                                // Iniciar sesión
                                req.session.currentUser = user;
                                this.daoCon.readConfigurationByIdUser(req.session.currentUser.id, (error, configuration) => {
                                    if (error) {
                                        errorHandler.manageError(error, {}, "error", next);
                                    }
                                    else {
                                        req.session.currentUser.configuration = configuration;
                                        this.daoAct.readActivityByIdUser(req.session.currentUser.id, (error, tasks) => {
                                            if (error) {
                                                errorHandler.manageError(error, {}, "error", next);
                                            }
                                            else {
                                                // Obtener notificaciones no leídas
                                                this.daoRem.unreadReminders(req.session.currentUser.id, (error, numunreadReminders) => {
                                                    if (error) {
                                                        errorHandler.manageError(error, {}, "error", next);
                                                    }
                                                    else {
                                                        let info = utils.getDailyInfo(utils.formatDate(new Date()), tasks);

                                                        next({
                                                            ajax: false,
                                                            status: 200,
                                                            redirect: "tasks",
                                                            data: {
                                                                response: undefined,
                                                                generalInfo: {
                                                                    remindersUnread: numunreadReminders
                                                                },
                                                                homeInfo: {
                                                                    day: info.day,
                                                                    week: undefined
                                                                },
                                                                tasks: info.tasks
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
    logout(req, res, next) {
        req.session.destroy();
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

    // Actualizar configuración del usuario
    updateConfiguration(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let form = {
                id_user: req.session.currentUser.id,
                font_size: req.body.font_size,
                theme: req.body.theme,
                time_preference: req.body.time_preference,
                reward_type: req.body.reward,
            }
            this.daoCon.updateConfiguration(form, (error) => {
                if (error) {
                    errorHandler.manageAJAXError(error, next);
                }
                else {
                    if (form.font_size === req.session.currentUser.configuration.font_size 
                        && form.theme === req.session.currentUser.configuration.theme 
                        && form.time_preference === req.session.currentUser.configuration.time_preference
                        && form.reward_type === req.session.currentUser.configuration.reward_type ) {
                            errorHandler.manageAJAXError(15, next);
                    }
                    else {
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
                }
            });
        }
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }
}

module.exports = ControllerUser;