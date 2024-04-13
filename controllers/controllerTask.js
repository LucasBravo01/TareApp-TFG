"use strict"

const moment = require('moment');
const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");


class ControllerTask {
    // Constructor
    constructor(daoTas, daoAct, daoCat, daoSub, daoRew, daoUse) {
        this.daoTas = daoTas;
        this.daoAct = daoAct;
        this.daoCat = daoCat;
        this.daoSub = daoSub;
        this.daoRew = daoRew;
        this.daoUse = daoUse;

        this.dataForm = this.dataForm.bind(this);
        this.getFormTask = this.getFormTask.bind(this);
        this.createTask = this.createTask.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.getTask = this.getTask.bind(this);
    }

    dataForm(req, res, next) {
        this.daoCat.readAllCategories((error, categories) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                this.daoSub.readAllSubjects((error, subject) => {
                    if (error) {
                        errorHandler.manageError(error, {}, "error", next);
                    }
                    else {
                        this.daoRew.readAllRewards((error, reward) => {
                            if (error) {
                                errorHandler.manageError(error, {}, "error", next);
                            }
                            else {
                                let dataTask = {
                                    categories: categories,
                                    rewards: reward,
                                    subjects: subject
                                }
                                req.dataTask = dataTask;
                                next();
                            }
                        });
                    }
                });
            }
        });
    }

    getFormTask(req, res, next) {
        next({
            ajax: false,
            status: 200,
            redirect: "createTask",
            data: {
                response: undefined,
                generalInfo: {},
                data: req.dataTask,
                task: {}
            }
        });
    }

    createTask(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoAct.checkActivityExists(req.body, (error, result) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                } else if (!result) {
                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next); //TODO Mirar que numero poner
                } else {
                    if (req.body.category !== "Escolar" && req.body.subject !== undefined) {
                        errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next); //TODO Mirar que numero poner
                    } else {
                        // Comprobar que el día y la hora son posteriores a hoy
                        let currentDate = moment(); // Momento actual
                        // Juntar fecha y hora en un "moment"
                        let dateAndHour = `${req.body.date} ${req.body.time}`;
                        let momentRes = moment(dateAndHour, 'YYYY-MM-DD HH:mm');
                        // Comprobar si la fecha y hora son posteriores a la actual
                        if (momentRes.isBefore(currentDate)) {
                            errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next);//TODO Mirar que numero poner
                        } else {
                            this.daoCat.checkCategoryExists(req.body.category, (error, result) => {
                                if (error) {
                                    errorHandler.manageError(error, {}, "error", next);
                                } else if (!result) {
                                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next); //TODO Mirar que numero poner
                                } else {
                                    this.daoRew.checkRewardExists(req.body.reward, (error, result) => {
                                        if (error) {
                                            errorHandler.manageError(error, {}, "error", next);
                                        } else if (!result) {
                                            errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next); //TODO Mirar que numero poner
                                        } else {
                                            this.daoSub.checkSubjectExists(req.body.subject, (error, result) => {
                                                if (error) {
                                                    errorHandler.manageError(error, {}, "error", next);
                                                } else if (!result && req.body.categoria === "Escolar") {
                                                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next); //TODO Mirar que numero poner
                                                } else {
                                                    let form = {
                                                        id: req.body.id,
                                                        title: req.body.title,
                                                        time: req.body.time,
                                                        date: req.body.date,
                                                        description: req.body.description,
                                                        category: req.body.category,
                                                        subject: req.body.subject,
                                                        reminders: req.body.reminders,
                                                        reward: req.body.reward,
                                                        duration: req.body.duration
                                                    }
                                                    this.daoAct.pushActivity(form, (error, task) => {
                                                        if (error) {
                                                            errorHandler.manageError(error, {}, "error", next);
                                                        }
                                                        else {
                                                            console.log('Hola C1');
                                                            this.daoTas.pushTask(task, (error) => {
                                                                if (error) {
                                                                    errorHandler.manageError(error, {}, "error", next);
                                                                }
                                                                else {
                                                                    console.log('Tarea Añadida');
                                                                    this.daoAct.readAllByUser(req.session.currentUser.id, (error, tasks) => {
                                                                        if (error) {
                                                                            errorHandler.manageError(error, {}, "error", next);
                                                                        }
                                                                        else {
                                                                            next({
                                                                                ajax: false,
                                                                                status: 200,
                                                                                redirect: "tasks",
                                                                                data: {
                                                                                    response: { code: 200, title: "Tarea Creada Con Éxito.", message: "Enhorabuena tu tarea ha sido creada correctamente." },
                                                                                    generalInfo: {},
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
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }
        else {
            console.log("Campos vacios");
            errorHandler.manageError(parseInt(errors.array()[0].msg), { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next); //TODO Mirar que numero poner
        }
    }

    getTasks(req, res, next) {
        this.daoAct.readAllByUser(req.session.currentUser.id, (error, tasks) => {
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
                        generalInfo: {},
                        tasks: tasks
                    }
                });
            }
        });
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
                        errorHandler.manageError(-3, {}, "error", next); //TODO Mirar que numero poner
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
                                    redirect: "createTask",
                                    data: {
                                        response: undefined,
                                        generalInfo: {},
                                        data: req.dataTask,
                                        task: task
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