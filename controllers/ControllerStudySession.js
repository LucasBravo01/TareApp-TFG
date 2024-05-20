"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

class ControllerStudySession {
    // Constructor
    constructor(daoStu) {
        this.daoStu = daoStu;

        // GETs
        this.getStudySessions = this.getStudySessions.bind(this);
        // POSTs
        this.createStudySession = this.createStudySession.bind(this);
    }

    // GETs
    // Cargar vista de sesión de estudio
    getStudySessions(req, res, next) {
        this.daoStu.readStudySessionsByIdUser(req.session.currentUser.id, (error, studySessions) => {
            if(error) {
                errorHandler.manageError(error, {}, "error", next);
            } else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "study_session",
                    data: {
                        response: undefined,
                        generalInfo: {
                            remindersUnread: req.unreadReminders
                        },
                        studySessions: studySessions,
                        tasks: req.tasks
                    }
                });
            }
        });
    }

    // POSTs
    // Crear sesión de estudio
    createStudySession(req, res, next) {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            if(req.body.longBreakSlot != 0 && req.body.numLongSlots == 0) {
                errorHandler.manageAJAXError(20, next);
            }
            else {
                if(req.body.numLongSlots != 0 && req.body.longBreakSlot < 1) {
                    errorHandler.manageAJAXError(19, next);
                }
                else {
                    if(req.body.numLongSlots >= req.body.numSlots) {
                        errorHandler.manageAJAXError(21, next);
                    }
                    else{
                        let studySession = {
                            name: req.body.name,
                            idUser: req.session.currentUser.id,
                            studySlot: req.body.studySlot,
                            breakSlot: req.body.breakSlot,
                            longBreakSlot: req.body.longBreakSlot,
                            numSlots: req.body.numSlots,
                            numLongSlots: req.body.numLongSlots
                        }
            
                        this.daoStu.insertStudySession(studySession, (error) => {
                            if (error) {
                                errorHandler.manageAJAXError(error, next);
                            } else {
                                next({
                                    ajax: true,
                                    error: false,
                                    img: false,
                                    data: {
                                        code: 200,
                                        title: "Sesión de estudio creada con éxito.",
                                        message: "Enhorabuena se ha creado correctamente la sesión de estudio."
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }
}

module.exports = ControllerStudySession;