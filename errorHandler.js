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
            title = "Acceso no premitido";
            message = "No sé a dónde estabas intentando acceder, pero no puedes!";
        } break;
        case -4: {
            code = 403;
            title = "Instalación no válida";
            message = "No tienes permiso para reservar esta instalación (o no existe).";
        } break;
        case -5: {
            code = 403;
            title = "Petición no válida";
            message = "No sé qué estás intentando hacer, pero no lo estás haciendo bien!";
        } break;
        case -6: {
            code = 403;
            title = "Petición no válida";
            message = "No sé qué estabas intentando cancelar, pero no lo estás haciendo bien!";
        } break;    
        case -7: {
            code = 403;
            title = "Petición no válida";
            message = "No sé qué estabas intentando leer, pero no lo estás haciendo bien!";
        } break;
        case -8: {
            code = 403;
            title = "Instalación no válida";
            message = "No sé qué estabas intentando hacer, pero no puedes!";
        } break;
        // Bad Request
        case 1: {
            code = 400;
            title = "Campos vacíos";
            message = "Asegúrate de rellenar todos los campos.";
        } break;
        case 2: {
            code = 400;
            title = "Correo no válido";
            message = "Tu correo no pertenece a una universidad.";
        } break;
        case 3: {
            code = 400;
            title = "Usuario no existente";
            message = "El correo introducido no está registrado o has sido expulsado. Debes crear una cuenta primero y ser validado.";
        } break;
        case 4: {
            code = 400;
            title = "No validado";
            message = "Aún no has sido validado por uno de los administradores de tu universidad. Este proceso no debería durar más de 24h, contacta con un superior si persiste el problema.";
        } break;
        case 5: {
            code = 400;
            title = "Contraseña no válida";
            message = "La contraseña introducida no es correcta.";
        } break;
        case 6: {
            code = 403;
            title = "Acceso no permitido";
            message = "Has sido expulsado de la aplicación por un administrados. Si crees que ha sido un problema, contacta con un superior de tu universidad.";
        } break;
        case 7: {
            code = 400;
            title = "Nº personas no válido";
            message = "Recuerda introducir un número de personas válido y que sea menor o igual que el aforo de la instalación que deseas reservar.";
        } break;
        case 8: {
            code = 400;
            title = "Fecha y hora no válidas";
            message = "La reserva debe realizarse en un día (y hora) posterior a este momento.";
        } break;
        case 9: {
            code = 400;
            title = "Fecha no válida";
            message = "Las instalaciones no están disponibles los fines de semana.";
        } break;
        case 10: {
            code = 400;
            title = "Demasiadas personas";
            message = "La instalación no tiene aforo suficiente para las personas que has solicitado.";
        } break;
        case 11: {
            code = 400;
            title = "Hora no válida";
            message = "La hora no está incluida en el rango disponible para esta instalación.";
        } break;
        case 12: {
            code = 400;
            title = "Reserva fallida";
            message = "Ya habías realizado una reserva de esta instalación en el día y la hora indicados. Si deseas modificar la que hiciste, deberás cancelarala y volver a realizarla, pero se te sacará de la cola.";
        } break;
        case 13: {
            code = 400;
            title = "Dirección web no válida";
            message = "La dirección web proporcionada no es una URL válida.";
        } break;
        case 14: {
            code = 400;
            title = "Imagen no válida";
            message = "La imagen debe ser un fichero de tipo .png y no superar los 64KB.";
        } break;
        case 15: {
            code = 400;
            title = "Contraseña no válida";
            message = "La contraseña debe tener al menos 8 caracteres, de los cuales al menos 1 debe ser un número y 1 una letra.";
        } break;
        case 16: {
            code = 400;
            title = "Facultad no válida";
            message = "Por favor, asegúrate de seleccionar una facultad de las disponibles.";
        } break;
        case 17: {
            code = 400;
            title = "Usuario ya registrado";
            message = "Este correo ya está registrado en la universidad.";
        } break;
        case 18: {
            code = 400;
            title = "Usuario expulsado";
            message = "No se puede validar un usuario expulsado.";
        } break;
        case 19: {
            code = 400;
            title = "Usuario ya validado";
            message = "Este usuario ya está validado.";
        } break;
        case 20: {
            code = 400;
            title = "Reserva ya cancelada";
            message = "Ya habías cancelado esta reserva!";
        } break;
        case 21: {
            code = 400;
            title = "Reserva pasada";
            message = "No puedes cancelar una reserva que ya ha pasado.";
        } break;
        case 22: {
            code = 400;
            title = "Usuario no válido";
            message = "Recuerda introducir correctamente el correo del usuario al que quieres escribir sólo con la parte que va antes del @.";
        } break;
        case 23: {
            code = 400;
            title = "Usuario no válido";
            message = "El usuario al que deseas mandar el mensaje no existe en tu organización o no está validado todavía.";
        } break;
        case 24: {
            code = 400;
            title = "Destino no válido";
            message = "Sólo puedes enviar un mensaje a una de estas tres opciones: un usuario particular, todos los usuarios de una facultad o todos los usuarios de la universidad.";
        } break;
        case 25: {
            code = 501;
            title = "Funcionalidad no implementada";
            message = "Oops! Esta funcionalidad aún no está disponible :(";
        } break;
        case 26: {
            code = 400;
            title = "Mensaje ya leído";
            message = "Este mensaje ya lo habías leído.";
        } break;
        case 27: {
            code = 400;
            title = "Hora no válida";
            message = "Las horas de apertura y cierre deben ser horas en punto, y la hora de cierre debe ser posterior a la de apertura.";
        } break;
        case 28: {
            code = 400;
            title = "Aforo no válido";
            message = "El aforo debe ser un número mayor que 0.";
        } break;
        case 29: {
            code = 400;
            title = "Tipo de instalación no válido";
            message = "Por favor, asegúrate de seleccionar un tipo de los disponibles, o crea uno nuevo.";
        } break;
        case 30: {
            code = 400;
            title = "Instalación repetida";
            message = "Ya existe una instalación de este tipo con el nombre introducido.";
        } break;
        case 31: {
            code = 400;
            title = "Usuario ya es administrador";
            message = "El usuario al que intentas hacer administrador ya lo es.";
        } break;
        case 32: {
            code = 400;
            title = "Tipo de reserva no válido";
            message = "El tipo de reserva tiene que ser Individual o Colectiva.";
        } break;
        case 33: {
            code = 400;
            title = "Usuario expulsado";
            message = "No se puede volver a expulsar un usuario que ya lo está.";
        } break;
        case 34: {
            code = 400;
            title = "Usuario no válido";
            message = "El usuario al que deseas hace administrador no está validado todavía.";
        } break;
        case 35: {
            code = 400;
            title = "Usuario es administrador";
            message = "No puedes expulsar a un usuario que es administrador.";
        } break;
        case 36: {
            code = 400;
            title = "Mensaje vacío";
            message = "El mensaje que quieres mandar no puede estar vacío.";
        } break;
        case 37: {
            code = 400;
            title = "Correo vacío";
            message = "Recuerda indicar a quién quieres mandar el correo, escribiendo sólo con la parte que va antes del @.";
        } break;
        case 38: {
            code = 400;
            title = "Fecha no válida";
            message = "Indica una fecha válida en el calendario.";
        } break;
        case 39: {
            code = 400;
            title = "Contraseña no válida";
            message = "La nueva contraseña debe ser distinta a la antigua.";
        } break;
        case 40: {
            code = 400;
            title = "Ningún campo modificado";
            message = "El nombre y la foto de la instalación son iguales que como eran antes.";
        } break;
        case 41: {
            code = 400;
            title = "Tipo repetido";
            message = "El tipo de instalación introducido ya existía.";
        } break;
        case 42: {
            code = 400;
            title = "Tipo no seleccionado";
            message = "Por favor, selecciona el tipo de instalación que deseas o crea uno nuevo.";
        } break;
        case 43: {
            code = 400;
            title = "Universidad existente";
            message = "Ya existe una universidad con ese nombre, por favor ingresa otro.";
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
    // Bad Request
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