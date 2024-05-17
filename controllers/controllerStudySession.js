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

            if(req.body.longBrakeSlot !== null && req.body.numLongSlots === null) {
                errorHandler.manageAJAXError("1", next);
            }

            let studysession = {
                name: req.body.name,
                idUser: req.session.currentUser.id,
                studySlot: req.body.studySlot,
                brakeSlot: req.body.brakeSlot,
                longBrakeSlot: req.body.longBrakeSlot,
                numSlots: req.body.numSlots,
                numLongSlots: req.body.numLongSlots
            }

            this.daoStu.insertStudySession(studysession, (error) => {
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
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }
}

module.exports = ControllerStudySession;