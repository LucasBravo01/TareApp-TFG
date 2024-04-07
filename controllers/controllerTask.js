"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");
const { response } = require("express");

class ControllerTask {
    // Constructor
    constructor(daoTas, daoUse) {
        this.daoTas = daoTas;
        this.daoUse = daoUse

        this.getTask = this.getTask.bind(this);
    }

    // Obtener tarea dado un id
    getTask(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoTas.getTaskById(req.params.id, (error, task) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    if (task.idCreator !== req.session.currentUser.id ) {
                        errorHandler.manageError(-3, {}, "error", next); //TODO cambiar número
                    }
                    else {
                        this.daoUse.readById(req.session.currentUser.id, (error, user) => {
                            if (error) {
                                errorHandler.manageError(error, {}, "error", next);
                            }
                            else {
                                task.user = user;
                                next({
                                    ajax: false,
                                    status: 200,
                                    redirect: "task",
                                    data: {
                                        task: task,
                                        response: undefined,
                                        generalInfo: {}
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
        }        
    }

    
}

module.exports = ControllerTask;