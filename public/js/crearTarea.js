"use strict"

// Validación Cliente
function validateParams(params, currentDate) {
    let error = {};
    let selectedDate = params.date + params.hour;
    // Campos no vacíos
    if (params.title === "" || params.date === "" || params.hour === "" || params.category === "" || params.subject === "" || params.reward === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    else if (selectedDate) {

    }
    else {
        return null;
    }
}

$(() => {
    // Obtener elementos
    const formTask = document.getElementById("formTarea");
    const inputTitle = $("#input-title");
    const inputDate = $("#input-date");
    const inputHour = $("#input-hour");
    const inputCategory = $("#input-category");
    const inputSubject = $("#input-subject");
    const inputReward = $("#input-reward");
    const submitButton = $("#input-sb-createTask");

    // Obtener la fecha y hora actual
    let currentDate = new Date();
    let currentDateString = currentDate.toISOString().split('T')[0]; // Formato para input type="date"
    // Establecer la fecha y hora actual como el valor mínimo para los campos de entrada
    inputDate.attr("min", currentDateString);


    // Añadimos un event listener al cambio de la opción seleccionada en el select de categoría
    inputCategory.on("change", () => {
        // Si la opción seleccionada es "Escolar", habilitamos el select de asignatura
        if (inputCategory.val() === "Escolar") {
            inputSubject.removeAttr("disabled");
        } else {
            // Si no, deshabilitamos el select de asignatura y lo reseteamos
            inputSubject.attr("disabled", "true");
            inputSubject.val(""); // Esto establece la opción por defecto
        }
    });

    // POST login
    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            title: inputTitle.val(),
            date: inputDate.val(),
            hour: inputHour.val(),
            category: inputCategory.val(),
            subject: inputSubject.val(),
            reward: inputReward.val()
        };
        // Validar
        let error = validateParams(params, currentDate);
        if (!error) {
            formTask.submit();
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });    
});


