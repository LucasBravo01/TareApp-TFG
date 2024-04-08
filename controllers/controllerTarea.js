"use strict"

const errorHandler = require("../errorHandler");
const { validationResult } = require("express-validator");

class ControllerTarea {
    // Constructor
    constructor(daoTarea, daoActividad, daoCat) {
        this.daoTarea = daoTarea;
        this.daoActividad = daoActividad;
        this.daoCat = daoCat;

        this.crearTarea = this.crearTarea.bind(this);
        this.datosForm = this.datosForm.bind(this);
    }

    datosForm(req, res, next) {
        this.daoCat.readAll((error, categorias) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                /* console.log(categorias); */
                let datosCT = {
                    categorias: categorias
                }
                req.session.datosCT = datosCT;
                next({
                    ajax: false,
                    status: 200,
                    redirect: "crearTarea",
                    data: {
                        response: undefined,
                        generalInfo: {},
                        data:datosCT 
                    }
                  });
            }
        });
    }

    crearTarea(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let form =  {
                id: req.body.id,
                titulo: req.body.titulo,
                hora: req.body.hora,
                fecha: req.body.fecha,
                descripcion: req.body.descripcion,
                categoria:req.body.categoria,
                asignatura:req.body.asignatura,
                recordatorios:req.body.recordatorios,
                duracion: req.body.duracion
              }
              
              this.daoActividad.pushActividad(form, (error, actividad) => {
                  if (error) {
                      errorHandler.manageError(error, {}, "error", next);            }
                  else {
                      console.log('Actividad Añadida');
                      this.daoTarea.pushTarea(actividad, (error) => {
                          if (error) {
                              errorHandler.manageError(error, {}, "error", next);
                          }
                          else {
                              console.log('Tarea Añadida');
                              res.status(200).json({ resultado: "Tarea creada con exito." });
                          }
                      });
                  }
              }) ;
        }
        else {
            console.log("Campos vacios");
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next); //TODO
        }
    }
}

//errorHandler.manageError(error, {data: req.session.datosCT}, "crearTarea", next);

module.exports = ControllerTarea;