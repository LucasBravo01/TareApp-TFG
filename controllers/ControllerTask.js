"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");
const utils = require("../utils");


class ControllerTask {
    // Constructor
    constructor(daoAct, daoCat, daoCon, daoRem, daoRew, daoSub, daoTas, daoUse) {
        this.daoAct = daoAct;
        this.daoCat = daoCat;
        this.daoCon = daoCon;
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
        this.getNotCompletedTasks = this.getNotCompletedTasks.bind(this);
        // POSTs
        this.createTask = this.createTask.bind(this);
        this.modifyTask = this.modifyTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.markTaskAsCompleted = this.markTaskAsCompleted.bind(this);
        // OTROS
        this.dataForm = this.dataForm.bind(this);
        // PROPIAS
        this.createReminders = this.createReminders.bind(this);
    }

    // GETs
    // Cargar vista de lista de tareas
    getTasks(req, res, next) {
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
                        next({
                            ajax: false,
                            status: 200,
                            redirect: "home",
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
        });
    }

    // Cargar vista de calendario semanal
    getWeeklyTasks(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
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
                            let week = utils.getWeeklyInfo(req.params.day, tasks);

                            next({
                                ajax: false,
                                status: 200,
                                redirect: "home",
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
            })
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
        }
    }

    // Cargar vista de calendario diario
    getDailyTasks(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
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
                            let info = utils.getDailyInfo(req.params.day, tasks);

                            next({
                                ajax: false,
                                status: 200,
                                redirect: "home",
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
            })
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
            redirect: "task",
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
                    if (task.idReceiver !== req.session.currentUser.id) {
                        errorHandler.manageError(-3, {}, "error", next);
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
                                    redirect: "task",
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

    // Obtener tareas no completadas
    getNotCompletedTasks(req, res, next) {
        this.daoAct.readActivityByIdUser(req.session.currentUser.id, (error, tasks) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            } else {
                tasks.forEach( t => {
                    t.date = utils.formatDate(t.date);
                    t.time = utils.formatHour(t.time);
                });
                req.tasks = tasks
                next();
            }
        });
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
                    errorHandler.manageError(10, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "task", next);
                } else {
                    if (req.body.category === "" && req.body.subject !== undefined) {
                        errorHandler.manageError(11, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "task", next);
                    } else {
                        let currentDate = new Date();
                        let taskDate = new Date(`${req.body.date}T${req.body.time}:00`);
                        // Comprobar si la fecha y hora son posteriores a la actual
                        if (taskDate <= currentDate) {
                            errorHandler.manageError(12, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "task", next);
                        } else {
                            this.daoCat.readCategoryByName(req.body.category, (error, result) => {
                                if (error) {
                                    errorHandler.manageError(error, {}, "error", next);
                                } else if (!result) {
                                    errorHandler.manageError(13, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "task", next);
                                } else {
                                    this.daoSub.readSubjectById(req.body.subject, (error, result) => {
                                        if (error) {
                                            errorHandler.manageError(error, {}, "error", next);
                                        } else if (!result && req.body.category === "Escolar") {
                                            errorHandler.manageError(14, { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "task", next);
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
                                                reward: Math.floor(Math.random() * 5) + 1,
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
                                                                                    next({
                                                                                        ajax: false,
                                                                                        status: 200,
                                                                                        redirect: "home",
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
                    }
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), { response: undefined, generalInfo: { remindersUnread: req.unreadReminders }, data: req.dataTask, task: {} }, "task", next);
        }
    }

    // Mofificar tarea
    modifyTask(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoAct.readActivity(req.body, (error, result) => {
                if (error) {
                    errorHandler.manageAJAXError(error, next);
                } else if (!result) {
                    errorHandler.manageAJAXError(10, next);
                } else {
                    if (req.body.category === "" && req.body.subject !== undefined) {
                        errorHandler.manageAJAXError(11, next);
                    } else {
                        let currentDate = new Date();
                        let taskDate = new Date(`${req.body.date}T${req.body.hour}:00`);
                        // Comprobar si la fecha y hora son posteriores a la actual
                        if (taskDate <= currentDate) {
                            errorHandler.manageAJAXError(12, next);
                        } else {
                            this.daoCat.readCategoryByName(req.body.category, (error, result) => {
                                if (error) {
                                    errorHandler.manageAJAXError(error, next);
                                } else if (!result) {
                                    errorHandler.manageAJAXError(13, next);
                                } else {
                                    this.daoSub.readSubjectById(req.body.subject, (error, result) => {
                                        if (error) {
                                            errorHandler.manageAJAXError(error, next);
                                        } else if (!result && req.body.category === "Escolar") {
                                            errorHandler.manageAJAXError(14, next);
                                        } else {
                                            let form = {
                                                id: req.body.id,
                                                title: req.body.title,
                                                time: req.body.hour,
                                                date: req.body.date,
                                                description: req.body.description,
                                                category: req.body.category,
                                                subject: req.body.subject,
                                                reminders: req.body.reminder,
                                                reward: Math.floor(Math.random() * 5) + 1,
                                                duration: req.body.duration,
                                                idTaskModify: req.body.idTask
                                            }
                                            this.daoAct.updateActivity(form, (error, task) => {
                                                if (error) {
                                                    errorHandler.manageAJAXError(error, next);
                                                }
                                                else {
                                                    this.daoTas.updateTask(task, (error) => {
                                                        if (error) {
                                                            errorHandler.manageAJAXError(error, next);
                                                        }
                                                        else {
                                                            this.daoRem.deleteRemindersByTaskId(form.idTaskModify, (error) => {
                                                                if (error) {
                                                                    errorHandler.manageAJAXError(error, next);
                                                                }
                                                                else {
                                                                   this.createReminders(form, task.id)
                                                                    .then(() => {
                                                                        this.daoCon.readConfigurationByIdUser(req.session.currentUser.id, (error, configuration) => {
                                                                            if (error) {
                                                                                errorHandler.manageAJAXError(error, next);
                                                                            }
                                                                            else {
                                                                                req.session.currentUser.configuration = configuration;
                                                                                this.daoAct.readActivityByIdUser(req.session.currentUser.id,  (error, tasks) => {
                                                                                    if (error) {
                                                                                        errorHandler.manageAJAXError(error, next);
                                                                                    }
                                                                                    else {
                                                                                        next({
                                                                                            ajax: true,
                                                                                            error: false,
                                                                                            img: false,
                                                                                            data: {
                                                                                                code: 200,
                                                                                                title: "Tarea Modificada Con Éxito.",
                                                                                                message: "Enhorabuena tu tarea ha sido modificada correctamente."
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
    
                                                                    })
                                                                    .catch((error) => {
                                                                        errorHandler.manageAJAXError(error, next);
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
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }

    // Borrar tarea
    deleteTask(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            this.daoTas.readTaskById(req.params.id, (error, task) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    if (task.idReceiver !== req.session.currentUser.id) {
                        errorHandler.manageError(-3, {}, "error", next);
                    }
                    else {
                        this.daoAct.deleteActivity(task.id, true, (error) => {
                            if (error) {
                                errorHandler.manageError(error, {}, "error", next);
                            }
                            else {
                                this.daoRem.updateReminders(task.id, true, (error) => {
                                    if (error) {
                                        errorHandler.manageError(error, {}, "error", next);
                                    }
                                    else {
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
                                                        next({
                                                            ajax: false,
                                                            status: 200,
                                                            redirect: "home",
                                                            data: {
                                                                response: { code: 200, title: "Tarea borrada", message: `La tarea "${task.title}" ha sido borrada con éxito`},
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
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
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
                    this.daoRew.readRewardsByTask(task.idReward, (error, reward) => {
                        if (error) {
                            errorHandler.manageAJAXError(error, next);
                        } else {
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
                                                if (req.session.currentUser.configuration.rewardType === 'mensaje') {
                                                    data.message = `${reward.message}`;
                                                    data.image = null;
                                                } else if (req.session.currentUser.configuration.rewardType === 'medalla') {
                                                    data.message = `¡Enhorabuena! Has conseguido una nueva medalla. Puedes verlas todas en tu perfil.`;
                                                    data.image = "/images/rewards/badges/" + reward.icon + ".png";
                                                } else if (req.session.currentUser.configuration.rewardType === 'imagen') {
                                                    data.message = `¡Enhorabuena, sigue así!`;
                                                    data.image = "/images/rewards/images/" + reward.icon + ".png";
                                                } else if (req.session.currentUser.configuration.rewardType === 'gif') {
                                                    data.message = `¡Enhorabuena!`;
                                                    data.image = "/images/rewards/gifs/" + reward.icon + ".gif";
                                                }
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
                    });                    
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
            case "10 minutos antes": numRem = 1; break;
            case "1 hora antes": numRem = 1; break;
            case "1 día antes": numRem = 1; break;
            case "Desde 2 días antes": numRem = 2; break;
            case "Desde 1 semana antes": numRem = 7; break;
            case "No recordarmelo": numRem = 0; break;
            default: numRem = 0; break;
        }
        for (let i = 1; i <= numRem; i++) {
            let reminderDate = new Date(form.date);
            let timeParts = form.time.split(":");
            let hour = parseInt(timeParts[0]);
            let minute = parseInt(timeParts[1]);
            let message;
            if (form.reminders === "10 minutos antes") {
                reminderDate.setHours(hour, minute - 10, 0, 0);
                if (reminderDate <= currentDate)
                    continue;
                message = `¡Solo quedan 10 minutos para la tarea "${form.title}"! ¡No te distraigas!`;
            } else if (form.reminders === "1 hora antes") {
                reminderDate.setHours(hour - 1, minute, 0, 0);
                if (reminderDate <= currentDate)
                    continue;
                message = `¡Recuerda que en 1 hora tienes la tarea "${form.title}"! ¡No lo olvides!`;
            } else {
                reminderDate.setDate(date.getDate() - i);
                reminderDate.setHours(hour, minute, 0, 0);
            }
            if (form.reminders !== "10 minutos antes" && form.reminders !== "1 hora antes") {
                if (reminderDate <= currentDate)
                    continue;

                let daysDifference = Math.floor((date.getDate() - reminderDate.getDate()));

                if (daysDifference > 1)
                    message = `¡Ánimo! Aún te quedan ${daysDifference} días para terminar la tarea "${form.title}"`;
                else
                    message = `Mañana termina el plazo para la tarea "${form.title}"¡A por ello, tú puedes!`;
            }

            let reminder = {
                id: form.id,
                sentDate: reminderDate,
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