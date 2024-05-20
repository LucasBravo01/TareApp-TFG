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
            let params = req.body;
            params.numLongSlots = isNaN(params.numLongSlots) ? 0 : params.numLongSlots;
            params.longBreakSlot = isNaN(params.longBreakSlot) ? 0 : params.longBreakSlot;
            if(params.longBreakSlot != 0 && params.numLongSlots == 0) {
                errorHandler.manageAJAXError(20, next);
            }
            else {
                if(params.numLongSlots != 0 && params.longBreakSlot < 1) {
                    errorHandler.manageAJAXError(19, next);
                }
                else {
                    if(params.numLongSlots >= params.numSlots) {
                        errorHandler.manageAJAXError(21, next);
                    }
                    else{
                        let studySession = {
                            name: params.name,
                            idUser: req.session.currentUser.id,
                            studySlot: params.studySlot,
                            breakSlot: params.breakSlot,
                            longBreakSlot: params.longBreakSlot,
                            numSlots: params.numSlots,
                            numLongSlots: params.numLongSlots
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