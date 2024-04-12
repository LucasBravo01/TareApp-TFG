"use strict"

const errorHandler = require("../errorHandler");
const { validationResult } = require("express-validator");
const moment = require('moment');


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
                                let datosCT = {
                                    categories: categories,
                                    rewards: reward,
                                    subjects: subject
                                }
                                req.datosCT = datosCT;
                                console.log(datosCT);
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
                data: req.datosCT,
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
                    console.log('Ya existe actividad');
                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "createTask", next); //TODO Mirar que numero poner
                } else {
                    if (req.body.category !== "Escolar" && req.body.subject !== undefined) {
                        console.log('Escolar y no asignatura');
                        errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "createTask", next); //TODO Mirar que numero poner
                    } else {
                        // Comprobar que el día y la hora son posteriores a hoy
                        let currentDate = moment(); // Momento actual
                        // Juntar fecha y hora en un "moment"
                        let dateAndHour = `${req.body.date} ${req.body.time}`;
                        let momentRes = moment(dateAndHour, 'YYYY-MM-DD HH:mm');
                        // Comprobar si la fecha y hora son posteriores a la actual
                        if (momentRes.isBefore(currentDate)) {
                            console.log('Horas y fecha mas definidas');
                            errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "createTask", next);//TODO Mirar que numero poner
                        } else {
                            this.daoCat.checkCategoryExists(req.body.category, (error, result) => {
                                if (error) {
                                    errorHandler.manageError(error, {}, "error", next);
                                } else if (!result) {
                                    console.log('No existe categoria');
                                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "createTask", next); //TODO Mirar que numero poner
                                } else {
                                    this.daoRew.checkRewardExists(req.body.reward, (error, result) => {
                                        if (error) {
                                            errorHandler.manageError(error, {}, "error", next);
                                        } else if (!result) {
                                            console.log('No existe recompensa');
                                            errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "createTask", next); //TODO Mirar que numero poner
                                        } else {
                                            this.daoSub.checkSubjectExists(req.body.subject, (error, result) => {
                                                if (error) {
                                                    errorHandler.manageError(error, {}, "error", next);
                                                } else if (!result && req.body.categoria === "Escolar") {
                                                    console.log('No existe asignatura');
                                                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "createTask", next); //TODO Mirar que numero poner
                                                } else {
                                                    let form = {
                                                        id: req.body.id,
                                                        title: req.body.title,
                                                        time: req.body.time,
                                                        date: req.body.date,
                                                        description: req.body.description,
                                                        category: req.body.category,
                                                        subject: req.body.subject,
                                                        recordatories: req.body.recordatories,
                                                        reward: req.body.reward,
                                                        duration: req.body.duration
                                                    }

                                                    this.daoAct.pushActivity(form, (error, task) => {
                                                        if (error) {
                                                            errorHandler.manageError(error, {}, "error", next);
                                                        }
                                                        else {
                                                            console.log('Actividad Añadida');
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
                                                                                redirect: "tareas",
                                                                                data: {
                                                                                    response: { code: 200, title: "Tarea Creada Con Éxito.", message: "Enhorabuena tu tarea ha sido creada correctamente." },
                                                                                    generalInfo: {},
                                                                                    tareas: tasks
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
            errorHandler.manageError(parseInt(errors.array()[0].msg), { response: undefined, generalInfo: {}, data: req.datosCT }, "createTask", next); //TODO Mirar que numero poner
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
                                        data: req.datosCT,
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

//errorHandler.manageError(error, {data: req.session.datosCT}, "crearTarea", next);

module.exports = ControllerTask;