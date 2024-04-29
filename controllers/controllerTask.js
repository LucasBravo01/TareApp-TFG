"use strict"

const moment = require('moment');
const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");
const utils = require("../utils");


class ControllerTask {
    // Constructor
    constructor(daoAct, daoCat, daoRem, daoRew, daoSub, daoTas, daoUse) {
        this.daoAct = daoAct;
        this.daoCat = daoCat;
        this.daoRem = daoRem;
        this.daoRew = daoRew;
        this.daoSub = daoSub;
        this.daoTas = daoTas;
        this.daoUse = daoUse;

        // GETs
        this.getTasks = this.getTasks.bind(this);
        this.getWeeklyTasks = this.getWeeklyTasks.bind(this);
        this.getDailyTasks = this.getDailyTasks.bind(this);
        this.getFormTask = this.getFormTask.bind(this);
        this.getTask = this.getTask.bind(this);
        // POSTs
        this.createTask = this.createTask.bind(this);
        this.markTaskAsCompleted = this.markTaskAsCompleted.bind(this);
        // OTROS
        this.dataForm = this.dataForm.bind(this);
        // PROPIAS
        this.createReminders = this.createReminders.bind(this);
    }

    // GETs
    // Cargar vista de lista de tareas
    getTasks(req, res, next) {
        this.daoAct.readActivityByIdUser(req.session.currentUser.id, (error, tasks) => {
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
                            remindersUnread: req.unreadReminders
                        },
                        homeInfo: {
                            day: undefined,
                            week: undefined
                        },
                        tasks: tasks
                    }
                });
            }
        });
    }

    // Cargar vista de calendario semanal
    getWeeklyTasks(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoAct.readActivityByIdUser(req.session.currentUser.id, (error, tasks) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    let week = utils.getWeeklyInfo(req.params.day, tasks);

                    next({
                        ajax: false,
                        status: 200,
                        redirect: "tasks",
                        data: {
                            response: undefined,
                            generalInfo: {
                                remindersUnread: req.unreadReminders
                            },
                            homeInfo: {
                                day: undefined,
                                week: week,
                            }
                        }
                    });
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
        }
    }

    // Cargar vista de calendario diario
    getDailyTasks(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoAct.readActivityByIdUser(req.session.currentUser.id, (error, tasks) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    let info = utils.getDailyInfo(req.params.day, tasks);

                    next({
                        ajax: false,
                        status: 200,
                        redirect: "tasks",
                        data: {
                            response: undefined,
                            generalInfo: {
                                remindersUnread: req.unreadReminders
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
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
        }
    }

    // Cargar vista de crear tareas
    getFormTask(req, res, next) {
        next({
            ajax: false,
            status: 200,
            redirect: "createTask",
            data: {
                response: undefined,
                generalInfo: {
                    remindersUnread: req.unreadReminders
                },
                data: req.dataTask,
                task: {}
            }
        });
    }

    // Obtener tarea dado un id
    getTask(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoTas.readTaskById(req.params.id, (error, task) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    if (task.idDestination !== req.session.currentUser.id) {
                        errorHandler.manageError(-3, {}, "error", next); //TODO Mirar que numero poner. Tiene que ser negativo
                    }
                    else {
                        this.daoUse.readUserById(req.session.currentUser.id, (error, user) => {
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
                                        generalInfo: {
                                            remindersUnread: req.unreadReminders
                                        },
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

    // POSTs
    // Crear tarea
    createTask(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoAct.readActivity(req.body, (error, result) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                } else if (!result) {
                    errorHandler.manageError(11, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "createTask", next);
                } else {
                    if (req.body.category !== "Escolar" && req.body.subject !== undefined) {
                        errorHandler.manageError(12, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "createTask", next);
                    } else {
                        // Comprobar que el día y la hora son posteriores a hoy
                        let currentDate = moment(); // Momento actual
                        let momentRes = moment(`${req.body.date} ${req.body.time}`, 'YYYY-MM-DD HH:mm'); // Momento de la tarea
                        // Comprobar si la fecha y hora son posteriores a la actual
                        if (momentRes.isBefore(currentDate)) {
                            errorHandler.manageError(13, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "createTask", next);
                        } else {
                            this.daoCat.readCategoryByName(req.body.category, (error, result) => {
                                if (error) {
                                    errorHandler.manageError(error, {}, "error", next);
                                } else if (!result) {
                                    errorHandler.manageError(14, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "createTask", next);
                                } else {
                                    this.daoRew.readRewardsById(req.body.reward, (error, result) => {
                                        if (error) {
                                            errorHandler.manageError(error, {}, "error", next);
                                        } else if (!result) {
                                            errorHandler.manageError(15, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "createTask", next);
                                        } else {
                                            this.daoSub.readSubjectById(req.body.subject, (error, result) => {
                                                if (error) {
                                                    errorHandler.manageError(error, {}, "error", next);
                                                } else if (!result && req.body.categoria === "Escolar") {
                                                    errorHandler.manageError(16, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "createTask", next);
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
                                                    this.daoAct.insertActivity(form, (error, task) => {
                                                        if (error) {
                                                            errorHandler.manageError(error, {}, "error", next);
                                                        }
                                                        else {
                                                            this.daoTas.insertTask(task, (error) => {
                                                                if (error) {
                                                                    errorHandler.manageError(error, {}, "error", next);
                                                                }
                                                                else {
                                                                    this.createReminders(form, task.id)
                                                                        .then(() => {
                                                                            this.daoAct.readActivityByIdUser(req.session.currentUser.id, (error, tasks) => {
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
                                                                                            generalInfo: {
                                                                                                remindersUnread: req.unreadReminders
                                                                                            },
                                                                                            homeInfo: {
                                                                                                day: undefined,
                                                                                                week: undefined
                                                                                            },
                                                                                            tasks: tasks
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        })
                                                                        .catch((error) => {
                                                                            errorHandler.manageError(error, {}, "error", next);
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
            errorHandler.manageError(parseInt(errors.array()[0].msg), { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "createTask", next);
        }
    }

    // Marcar o desmarcar tarea como completada
    markTaskAsCompleted(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let checked = parseInt(req.body.checkbox);
            this.daoTas.readTaskById(req.body.id, (error, task) => {
                if (error) {
                    errorHandler.manageAJAXError(error, next);
                }
                else {
                    if (!task) {
                        errorHandler.manageAJAXError(10, next);
                    }
                    else {
                        this.daoTas.markTaskAsCompleted(req.body.id, checked, (error) => {
                            if (error) {
                                errorHandler.manageAJAXError(error, next);
                            }
                            else {
                                this.daoRem.updateReminders(req.body.id, checked, (error) => {
                                    if (error) {
                                        errorHandler.manageAJAXError(error, next);
                                    }
                                    else {
                                        let data = { code: 200 };
                                        if (checked === 1) {
                                            data.title = "Tarea completada";
                                            data.message = `¡Enhorabuena! Has completado la tarea "${task.title}"`;
                                        }
                                        else {
                                            data.title = "Tarea pendiente";
                                            data.message = `Los recordatorios pendientes de esta tarea se han reanudado`;
                                        }
                                        next({
                                            ajax: true,
                                            error: false,
                                            img: false,
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
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }

    // OTROS
    // Cargar datos del formulario de tarea
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

    // PROPIAS
    // Crear los recordatorios de una tarea
    async createReminders(form, idTask) {
        // Dividir la fecha en sus componentes
        let [year, month, day] = form.date.split('-').map(Number);

        // Crear la fecha de la tarea
        let date = new Date(year, month - 1, day); // Restar 1 al mes ya que en JavaScript los meses van de 0 a 11
        let currentDate = new Date();

        // Cuantos
        let numRem = 0;
        switch (form.reminders) {
            case "1 día antes": numRem = 1; break;
            case "Desde 2 días antes": numRem = 2; break;
            case "Desde 1 semana antes": numRem = 7; break;
            case "No recordarmelo": numRem = 0; break;
            default: numRem = 0; break;
        }
        for (let i = 1; i <= numRem; i++) {
            let reminderDate = new Date(form.date);
            reminderDate.setDate(date.getDate() - i);
            reminderDate.setHours(8, 0, 0, 0);



            if (reminderDate <= currentDate) {
                continue;
            }
            let daysDifference = Math.floor((date.getDate() - reminderDate.getDate()));
            let message;
            if (daysDifference > 1)
                message = `¡Ánimo! Aún te quedan ${daysDifference} días para terminar la tarea "${form.title}"`;
            else
                message = `Mañana termina el plazo para la tarea "${form.title}"¡A por ello, tú puedes!`;

            let reminder = {
                id: form.id,
                sent_date: reminderDate,
                message: message,
                idActivity: idTask
            };
            try {
                await new Promise((resolve, reject) => {
                    this.daoRem.insertReminder(reminder, (error) => {
                        if (error) {
                            errorHandler.manageError(error, {}, "error", next);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            } catch (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
        }
    }
}

module.exports = ControllerTask;