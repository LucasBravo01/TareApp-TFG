"use strict"

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const errorHandler = require("../errorHandler");

class ControllerUser {
    // Constructor
    constructor(daoUse, daoCat) { // TODO daoCat es provisional hasta que se rediriga a inicio y no ha cetegorias
        this.daoUse = daoUse;
        this.daoCat = daoCat;

        this.login = this.login.bind(this);
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

                                // Construir data
                                let data = {
                                    response: undefined,
                                    generalInfo: {}
                                };
                                // TODO (Cambiar cuando sepamos que se necesita en inicio)
                                // Obtener tipos de instalaciones de la universidad
                                this.daoCat.readAll((error, categorias) => {
                                    if (error) {
                                        errorHandler.manageError(error, { user: req.body.user }, "login", next);
                                    }
                                    else {
                                        data.categorias = categorias;
                                        next({
                                            ajax: false,
                                            status: 200,
                                            redirect: "categorias",
                                            data: data
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