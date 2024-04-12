"use strict"

const errorHandler = require("../errorHandler");
const { validationResult } = require("express-validator");
const moment = require('moment');


class ControllerTarea {
    // Constructor
    constructor(daoTas, daoAct, daoCat, daoSub, daoRew, daoUse) {
        this.daoTas = daoTas;
        this.daoAct = daoAct;
        this.daoCat = daoCat;
        this.daoSub = daoSub;
        this.daoRew = daoRew;
        this.daoUse = daoUse;

        this.datosForm = this.datosForm.bind(this);
        this.getFormTask = this.getFormTask.bind(this);
        this.crearTarea = this.crearTarea.bind(this);
        this.getTareas = this.getTareas.bind(this);
        this.getTask = this.getTask.bind(this);
    }

    datosForm(req, res, next) {
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
                                    categorias: categories,
                                    recompensas: reward,
                                    asignaturas: subject
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
            redirect: "crearTarea",
            data: {
                response: undefined,
                generalInfo: {},
                data: req.datosCT,
                task: {}
            }
        });
    }

    crearTarea(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoAct.checkActividadExists(req.body, (error, result) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                } else if (!result) {
                    console.log('Ya existe actividad');
                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "crearTarea", next); //TODO Mirar que numero poner
                } else {
                    if (req.body.categoria !== "Escolar" && req.body.asignatura !== undefined) {
                        console.log('Escolar y no asignatura');
                        errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "crearTarea", next); //TODO Mirar que numero poner
                    } else {
                        // Comprobar que el día y la hora son posteriores a hoy
                        let currentDate = moment(); // Momento actual
                        // Juntar fecha y hora en un "moment"
                        let dateAndHour = `${req.body.fecha} ${req.body.hora}`;
                        let momentRes = moment(dateAndHour, 'YYYY-MM-DD HH:mm');
                        // Comprobar si la fecha y hora son posteriores a la actual
                        if (momentRes.isBefore(currentDate)) {
                            console.log('Horas y fecha mas definidas');
                            errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "crearTarea", next);//TODO Mirar que numero poner
                        } else {
                            this.daoCat.checkCategoriaExists(req.body.categoria, (error, result) => {
                                if (error) {
                                    errorHandler.manageError(error, {}, "error", next);
                                } else if (!result) {
                                    console.log('No existe categoria');
                                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "crearTarea", next); //TODO Mirar que numero poner
                                } else {
                                    this.daoRew.checkRecompensaExists(req.body.recompensa, (error, result) => {
                                        if (error) {
                                            errorHandler.manageError(error, {}, "error", next);
                                        } else if (!result) {
                                            console.log('No existe recompensa');
                                            errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "crearTarea", next); //TODO Mirar que numero poner
                                        } else {
                                            this.daoSub.checkAsignaturaExists(req.body.asignatura, (error, result) => {
                                                if (error) {
                                                    errorHandler.manageError(error, {}, "error", next);
                                                } else if (!result && req.body.categoria === "Escolar") {
                                                    console.log('No existe asignatura');
                                                    errorHandler.manageError(33, { response: undefined, generalInfo: {}, data: req.datosCT }, "crearTarea", next); //TODO Mirar que numero poner
                                                } else {
                                                    let form = {
                                                        id: req.body.id,
                                                        titulo: req.body.titulo,
                                                        hora: req.body.hora,
                                                        fecha: req.body.fecha,
                                                        descripcion: req.body.descripcion,
                                                        categoria: req.body.categoria,
                                                        asignatura: req.body.asignatura,
                                                        recordatorios: req.body.recordatorios,
                                                        recompensa: req.body.recompensa,
                                                        duracion: req.body.duracion
                                                    }

                                                    this.daoAct.pushActividad(form, (error, tarea) => {
                                                        if (error) {
                                                            errorHandler.manageError(error, {}, "error", next);
                                                        }
                                                        else {
                                                            console.log('Actividad Añadida');
                                                            this.daoTas.pushTarea(tarea, (error) => {
                                                                if (error) {
                                                                    errorHandler.manageError(error, {}, "error", next);
                                                                }
                                                                else {
                                                                    console.log('Tarea Añadida');
                                                                    this.daoAct.readAllByUser(req.session.currentUser.id, (error, tareas) => {
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
                                                                                    tareas: tareas
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
            errorHandler.manageError(parseInt(errors.array()[0].msg), { response: undefined, generalInfo: {}, data: req.datosCT }, "crearTarea", next); //TODO Mirar que numero poner
        }
    }

    getTareas(req, res, next) {
        this.daoAct.readAllByUser(req.session.currentUser.id, (error, tareas) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "tareas",
                    data: {
                        response: undefined,
                        generalInfo: {},
                        tareas: tareas
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
                                    redirect: "crearTarea",
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

module.exports = ControllerTarea;