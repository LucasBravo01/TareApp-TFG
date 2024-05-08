"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");
const utils = require("../utils");
const { response } = require("express");

class ControllerStudySession {
    // Constructor
    constructor(daoStu) {
        this.daoStu = daoStu;

        // GETs
        this.getStudySessions = this.getStudySessions.bind(this);
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
                    redirect: "studysession",
                    data: {
                        response: undefined,
                        generalInfo: {
                            remindersUnread: req.unreadReminders
                        },
                        studySessions: studySessions
                    }
                });
            }
        });
    }
}

module.exports = ControllerStudySession;