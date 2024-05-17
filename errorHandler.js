"use strict"

function generateError(cod) {
    let code;
    let title;
    let message;

    switch (cod) {
        // Errores mayores
        case -1: {
            code = 500;
            title = "Error con la Base de Datos";
            message = "Lo sentimos, se ha producido un error en la conexión con la Base de Datos. Por favor, vuelve a intentarlo en unos instantes.";
        } break;
        case -2: {
            code = 400;
            title = "Petición incorrecta";
            message = "Esta dirección no es válida.";
        } break;
        case -3: {
            code = 403;
            title = "Acceso no permitido";
            message = "No sé a dónde estabas intentando acceder, pero no puedes!";
        } break;
        case -4: {
            code = 400;
            title = "Tarea no existente";
            message = "La tarea que intentas modificar no existe.";
        } break;
        // Respuesta erronea (Bad Request)
        case 1: {
            code = 400;
            title = "Campos vacíos";
            message = "Asegúrate de rellenar todos los campos.";
        } break;
        case 2: {
            code = 400;
            title = "Elección de los recordatorios";
            message = "El campo de los recordatorios no es válido. Por favor, introduce uno adecuado.";
        } break;
        case 3: {
            code = 400;
            title = "Elección de la duración";
            message = "El campo de la duración no es válido. Por favor, introduce uno adecuado.";
        } break;
        case 4: {
            code = 400;
            title = "Error al marcar/desmarcar";
            message = "Se ha producido un error al marcar/desmarcar la tarea como completada. Por favor, vuelve a intentarlo en unos instantes.";
        } break;
        case 5: {
            code = 400;
            title = "Elección del tamaño de letra";
            message = "El campo del tamaño de letra no es válido. Por favor, introduce uno adecuado.";
        } break;
        case 6: {
            code = 403;
            title = "Elección del tema";
            message = "El campo del tema no es válido. Por favor, introduce uno adecuado.";
        } break;
        case 7: {
            code = 400;
            title = "Elección de la preferencia de tiempo";
            message = "El campo de la preferencia de tiempo no es válido. Por favor, introduce uno adecuado.";
        } break;
        case 8: {
            code = 400;
            title = "Usuario no existente";
            message = "No existe ningún usuario con ese nombre de usuario.";
        } break;
        case 9: {
            code = 400;
            title = "Contraseña no válida";
            message = "La contraseña introducida no es correcta.";
        } break;
        case 10: {
            code = 400;
            title = "Tarea ya existente";
            message = "Ya existe una tarea con el mismo título para el mismo momento.";
        } break;
        case 11: {
            code = 400;
            title = "Asignatura vacía";
            message = "Asegúrate de rellenar la asignatura para una tarea escolar.";
        } break;
        case 12: {
            code = 400;
            title = "Fecha y/o hora no válidas";
            message = "Asegúrate de que la fecha y hora no sean anteriores a la actual.";
        } break;
        case 13: {
            code = 400;
            title = "Categoría no existente";
            message = "La categoría asignada a la tarea no existe.";
        } break;
        case 14: {
            code = 400;
            title = "Asignatura no existente";
            message = "La asignatura asignada a la tarea no existe.";
        } break;
        case 15: {
            code = 400;
            title = "Campos no modificados";
            message = "Los campos de la configuración no han sido modificados.";
        } break;
        case 16: {
            code = 400;
            title = "Tipos no válidos";
            message = "Revisa los campos, hay algunos que no cumplen con un tipo correcto.";
        } break;
        case 17: {
            code = 400;
            title = "Elección del tipo de recompensa";
            message = "El tipo de recompensa no es válido. Por favor, introduce uno adecuado.";
        } break;
        default: {
            code = 500;
            title = "Error desconocido";
            message = "Lo sentimos, se ha producido un error desconocido.";
        }
    }

    return {
        code: code,
        title: title,
        message: message
    }
}

function manageError(error, data, redirect, next) {
    let errorObj = generateError(error);
    // Error mayor
    if (error < 0) {
        next({
            ajax: false,
            status: errorObj.code,
            redirect: "error",
            data: errorObj
        });
    }
    //  Respuesta erronea (Bad Request)
    else {
        data.response = errorObj;
        next({
            ajax: false,
            status: errorObj.code,
            redirect: redirect,
            data: data
        });
    }
}

function manageAJAXError(error, next) {
    let errorObj = generateError(error);
    next({
        ajax: true,
        status: errorObj.code,
        error: errorObj
    });
}

module.exports = {
    manageError: manageError,
    manageAJAXError: manageAJAXError
};