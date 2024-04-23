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
        this.getWeeklyTasks = this.getWeeklyTasks.bind(this);
        this.getDailyTasks = this.getDailyTasks.bind(this);
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

    getWeeklyTasks(req, res, next) {
        const { currentWeek, previous } = req.query;
    
        var startOfWeek = moment().startOf('isoWeek');
        var endOfWeek = moment().endOf('isoWeek');
    
        if (currentWeek && previous) {
            startOfWeek = moment(currentWeek, 'DD-MM-YYYY').add(previous === 'true' ? -7 : 7, 'days');
            endOfWeek = moment(startOfWeek).add(7, 'days');
        }
    
        this.daoTas.readAllByUserAndWeek(req.session.currentUser.id, startOfWeek.toDate(), endOfWeek.toDate(), (error, tasks) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            } else {
                let week = [];
                for (let m = moment(startOfWeek); m.isBefore(endOfWeek); m.add(1, 'days')) {
                    let dailyTasks = tasks.filter(task => moment(task.date).isSame(m, 'day'));
                    let taskTimeIndex = {};
    
                    dailyTasks.forEach(task => {
                        let hour = task.time.split(':')[0];
                        if (!taskTimeIndex[hour]) {
                            taskTimeIndex[hour] = 0;
                        }
                        task.index = taskTimeIndex[hour]++;
                    });
    
                    week.push({
                        dayName: m.format('dddd'),
                        dayNumber: m.format('D'),
                        date: m.format('DD-MM-YYYY'),
                        tasks: dailyTasks
                    });
                }
                res.render("weeklyCalendar", { week: week });
            }
        });
    }

    getDailyTasks(req, res, next) {
        let { currentDate, previous } = req.query; 
    
        // Usar la fecha dada o la fecha actual si no se proporciona ninguna
        let selectedDate = currentDate ? moment(currentDate, 'DD-MM-YYYY') : moment();
    
        if (previous === 'true') {
            selectedDate.subtract(1, 'days'); // Ir al día anterior si previous es true
        } else if (previous === 'false') {
            selectedDate.add(1, 'days'); // Ir al día siguiente si previous es false
        }
    
        var startOfDay = selectedDate.startOf('day');
    
        // Llamar a la función del DAO pasando solo startOfDay
        this.daoTas.readAllByUserAndDay(req.session.currentUser.id, startOfDay.toDate(), (error, tasks) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            } else {
                // Agrupar tareas por hora
                let hourlyTasks = {};
                for (let hour = 0; hour < 24; hour++) {
                    hourlyTasks[hour] = [];  // Preparar un arreglo para cada hora
                }
                
                if (tasks) {
                    tasks.forEach(task => {
                        let taskDate = moment(task.date);
                        let hour = taskDate.hour();  // Extrae la hora usando moment.js
                        hourlyTasks[hour].push(task);  // Agrega la tarea al arreglo correspondiente a la hora
                    }); 
                }
    
                res.render("dailyCalendar", {
                    day: {
                        dayName: selectedDate.format('dddd'),
                        dayNumber: selectedDate.format('D'),
                        date: selectedDate.format('DD-MM-YYYY')
                    },
                    tasks: hourlyTasks
                });
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