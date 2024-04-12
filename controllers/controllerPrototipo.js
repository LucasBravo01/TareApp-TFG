"use strict"


class ControllerPrototipo {
    // Constructor
    constructor(daoTar, daoSus) {
        this.daoTar = daoTar;
        this.daoSus = daoSus;

        this.getAllTareas = this.getAllTareas.bind(this);
        this.createTarea = this.createTarea.bind(this);
    }

    getAllTareas(req, res, next) {
        this.daoTar.getAllTareas(cb_getTar);// recopilar todos los usuarios
        function cb_getTar(err, result) {
            if (err) {
                console.log(err.message); // Mensaje de error en la consola
                res.status(500).json({ error: err.message });// Error y mandar a el ajax
                res.end();
            }
            else { res.status(200).json({ resultado: result }); }// Mandar la lista de usuarios
        }
    }

    createTarea(req, res, next) {
        const { tema, fecha } = req.body;
        this.daoTar.crearTarea(tema, fecha, cb_tarea);
        function cb_tarea(err, result) {
          if (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message }); // Enviar respuesta de error al cliente
          } else {
            console.log('Tarea creada correctamente en el servidor');
            res.status(200).json({ message: 'Tarea creada correctamente' }); // Enviar respuesta exitosa al cliente
          }
        }
      }
}

module.exports = ControllerPrototipo;