"use strict"

const errorHandler = require("../errorHandler");

class ControllerTarea {
    // Constructor
    constructor(daoTarea) {
        this.daoTarea = daoTarea;

        this.crearTarea = this.crearTarea.bind(this);
    }

    crearTarea(req, res, next) {
        let form = req.body;
        this.daoTarea.pushTarea(form, cb_PushTar);// insertar reserva nueva
        function cb_PushTar(err, result){
          if(err){
              console.log(err.message); // Mensaje de error en la consola
              res.status(500).json({ error: err.message });// Error y mandar a el ajax
              res.end();
          }
          else{res.status(200).json({ resultado: "Tarea creada con exito." });}  // Mandar mensaje de exito
        } 
    }
}

module.exports = ControllerTarea;