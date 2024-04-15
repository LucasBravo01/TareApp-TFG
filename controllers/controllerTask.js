"use strict"

const moment = require('moment');
const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");


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

        this.dataForm = this.dataForm.bind(this);
        this.getFormTask = this.getFormTask.bind(this);
        this.createTask = this.createTask.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.getTask = this.getTask.bind(this);
        this.createReminders = this.createReminders.bind(this);
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
                                                            this.daoTas.pushTask(task, (error) => {
                                                                if (error) {
                                                                    errorHandler.manageError(error, {}, "error", next);
                                                                }
                                                                else {
                                                                    this.createReminders(form, req)
                                                                    .then( () => {
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
            errorHandler.manageError(parseInt(errors.array()[0].msg), { response: undefined, generalInfo: {}, data: req.dataTask, task: {} }, "createTask", next); //TODO Mirar que numero poner
        }
    }

    async createReminders (form, req) {
        // Dividir la fecha en sus componentes
        let [year, month, day] = form.date.split('-').map(Number);
    
        // Crear la fecha de la tarea
        let date = new Date(year, month - 1, day); // Restar 1 al mes ya que en JavaScript los meses van de 0 a 11
        let currentDate = new Date();
        
        // Cuantos
        let numRem = 0;
        switch(form.reminders) {
            case "1 día antes": numRem = 1; break;
            case "Desde 2 días antes": numRem = 2; break;
            case "Desde 1 semana antes": numRem = 7; break;
            case "No recordarmelo": numRem = 0; break;
            default: numRem = 0; break;
        }
        for(let i = 1; i <= numRem; i++){
            let reminderDate = new Date(form.date);
            reminderDate.setDate(date.getDate() - i);
            reminderDate.setHours(8, 0, 0, 0);
            
            if(reminderDate <= currentDate){
                continue;
            }
            let reminder = {
                id: form.id,
                sent_date: reminderDate
            };
            try{
                await new Promise((resolve, reject)=>{
                    this.daoRem.pushReminderSystem(reminder, req.session.currentUser.username,(error) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                });
                console.log(`Reminder ${i} add`);
            }catch(error){
                console.log("Error try reminderPush");
            }
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