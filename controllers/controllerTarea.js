"use strict"

const errorHandler = require("../errorHandler");

class ControllerTarea {
    // Constructor
    constructor(daoTarea, daoActividad ) {
        this.daoTarea = daoTarea;
        this.daoActividad = daoActividad;

        this.crearTarea = this.crearTarea.bind(this);
        this.getTareas = this.getTareas.bind(this);
    }

    crearTarea(req, res, next) {
        let form =  {
          titulo: req.body.titulo,
          horaInicio: req.body.horaInicio,
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
                this.daoTarea.pushTarea(actividad, cb_PushTar);// insertar reserva nueva
                function cb_PushTar(err, result){
                  if(err){
                    errorHandler.manageError(error, {}, "error", next);                  }
                  else{
                    res.status(200).json({ resultado: "Tarea creada con exito." });
                    }  
                }   
            }
        }) ;
    }

    getTareas(req, res, next) {
        this.daoTarea.readAll((error, tareas) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "tareas",
                    data: {
                        response: undefined,
                        generalInfo: {},
                        tareas: tareas
                    }
                });
            }
        });
    }

    getTareas(req, res, next) {
        this.daoActividad.readAllByUser(req.session.currentUser.id, (error, tareas) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                        next({
                            ajax: false,
                            status: 200,
                            redirect: "tareas",
                            data: {
                                response: undefined,
                                generalInfo: {},
                                tareas: tareas
                            }
                        });
            }
        });
    }
}

module.exports = ControllerTarea;