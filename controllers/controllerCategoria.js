"use strict"

const errorHandler = require("../errorHandler");

class ControllerCategoria {
    // Constructor
    constructor(daoCat) {
        this.daoCat = daoCat;

        this.getCategorias = this.getCategorias.bind(this);
    }

    getCategorias(req, res, next) {
        this.daoCat.readAll((error, categorias) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "categorias",
                    data: {
                        response: undefined,
                        generalInfo: {},
                        categorias: categorias
                    }
                });
            }
        });
    }
}

module.exports = ControllerCategoria;