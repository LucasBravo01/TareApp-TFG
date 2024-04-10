"use strict"

const errorHandler = require("../errorHandler");
const { validationResult } = require("express-validator");
const moment = require('moment');


class ControllerTarea {
    // Constructor
    constructor(daoTarea, daoActividad, daoCat,daoAsignatura) {
        this.daoTarea = daoTarea;
        this.daoActividad = daoActividad;
        this.daoCat = daoCat;
        this.daoAsignatura = daoAsignatura;

        this.crearTarea = this.crearTarea.bind(this);
        this.datosForm = this.datosForm.bind(this);
        this.getFormTask = this.getFormTask.bind(this);
    }

    datosForm(req, res, next) {
        this.daoCat.readAll((error, categorias) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                this.daoAsignatura.readAll((error, asignaturas) => {
                    if (error) {
                        errorHandler.manageError(error, {}, "error", next);
                    }
                    else {
                        let datosCT = {
                            categorias: categorias,
                            asignaturas: asignaturas
                        }
                        req.datosCT = datosCT;
                        next();
                    }
                });
            }
        });
    }

    getFormTask(req, res, next) {
        next({
            ajax: false,
            status: 200,
            redirect: "crearTarea",
            data: {
                response: undefined,
                generalInfo: {},
                data:req.datosCT 
            }
          });
    }

    crearTarea(req, res, next) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            if(req.body.categoria !== "Escolar" && req.body.asignatura !==undefined){
                console.log('Escolar y no asignatura');
                errorHandler.manageError(33, {response: undefined, generalInfo: {}, data:req.datosCT }, "crearTarea", next); //TODO Mirar que numero ponerr
            }else{
                // Comprobar que el día y la hora son posteriores a hoy
                let currentDate = moment(); // Momento actual
                // Juntar fecha y hora en un "moment"
                let dateAndHour = `${req.body.fecha} ${req.body.hora}`;
                let momentRes = moment(dateAndHour, 'YYYY-MM-DD HH:mm');
                // Comprobar si la fecha y hora son posteriores a la actual
                if (momentRes.isBefore(currentDate)) {
                    console.log('Horas y fecha mas definidas');
                    errorHandler.manageError(33, {response: undefined, generalInfo: {}, data:req.datosCT }, "crearTarea", next);//TODO 
                }else{
                    this.daoCat.checkCategoriaExists(req.body.categoria, (error, result) => {
                        if (error) {
                            errorHandler.manageError(error, {}, "error", next);            
                        }else if (!result) {
                            console.log('No existe categoria');
                            errorHandler.manageError(33, {response: undefined, generalInfo: {}, data:req.datosCT }, "crearTarea", next); //TODO
                        }else {
                            this.daoAsignatura.checkAsignaturaExists(req.body.asignatura, (error, result) => {
                                if (error) {
                                    errorHandler.manageError(error, {}, "error", next);            
                                }else if (!result && req.body.categoria === "Escolar") {
                                    console.log('No existe asignatura');
                                    errorHandler.manageError(33, {response: undefined, generalInfo: {}, data:req.datosCT }, "crearTarea", next); //TODO
                                }else {
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
                                                                    response: {code:200, title: "Tarea Creada Con Éxito.", message: "Enhorabuena tu tarea ha sido creada correctamente."},
                                                                    generalInfo: {},
                                                                    categorias: categorias
                                                                }
                                                            });
                                                        }
                                                    });
                                                  }
                                              });
                                          }
                                      }) ;
                                }
                            });
                        }
                    });
                } 
            }
        }
        else {
            console.log("Campos vacios");
            errorHandler.manageError(parseInt(errors.array()[0].msg), {response: undefined, generalInfo: {}, data:req.datosCT }, "crearTarea", next); //TODO
        }
    }
}

//errorHandler.manageError(error, {data: req.session.datosCT}, "crearTarea", next);

module.exports = ControllerTarea;