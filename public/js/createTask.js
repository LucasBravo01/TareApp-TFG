"use strict"

// Validación Cliente
function validateParams(params, currentDate) {
    let taskDate = new Date(`${params.date}T${params.hour}:00`);
    let error = {};
    // Campos no vacíos
    if (params.title === "" || params.date === "" || params.hour === "" || params.category === ""|| params.duration === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Asignatura vacía cuando categoría es Escolar
    else if (params.category === "Escolar" && params.subject === "") {
        error.code = 400;
        error.title = "Asignatura vacía";
        error.message = "Asegúrate de rellenar la asignatura para una tarea escolar.";
        return error;
    }// Comprobar si la fecha y hora son posteriores a la actual
    else if (taskDate <= currentDate) {
        error.code = 400;
        error.title = "Fecha y/o hora no válidas";
        error.message = "Asegúrate de que la fecha y hora no sean anteriores a la actual.";
        return error;
    }
    else {
        return null;
    }
}

$(() => {
    // Obtener elementos
    const formTask = document.getElementById("formTask");
    const inputTitle = $("#input-title");
    const inputDate = $("#input-date");
    const inputHour = $("#input-hour");
    const inputCategory = $("#input-category");
    const inputSubject = $("#input-subject");
    const inputReminder = $("#input-reminder");
    const inputDescription = $("#input-description");
    const inputDuration = $("#input-duration");
    const submitButton = $("#input-sb-createTask");
    const inputIdtask = $("#input-id-task");
    const inputCompleted = $("#input-completed");

    // Comprobar si hay tarea que mostrar
    const task = $("body").data("task");

    // Ajustar datos tarea
    if (task.id) {
        // Rellenar campos faltantes
        inputCategory.val(task.category);
        inputSubject.val(task.idSubject);
        inputReminder.val(task.reminder);
        inputDuration.val(task.duration);

        // Deshabilitar campos
        inputTitle.attr("disabled", "true");
        inputDate.attr("disabled", "true");
        inputHour.attr("disabled", "true");
        inputCategory.attr("disabled", "true");
        inputSubject.attr("disabled", "true");
        inputReminder.attr("disabled", "true");
        inputDescription.attr("disabled", "true");
        inputDuration.attr("disabled", "true");

    }

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
            $('#subject-asterisk').removeClass('d-none'); // Mostrar el asterisco rojo
        } else {
            // Si no, deshabilitamos el select de asignatura y lo reseteamos
            inputSubject.attr("disabled", "true");
            $('#subject-asterisk').addClass('d-none'); // Ocultar el asterisco rojo
            inputSubject.val(""); // Esto establece la opción por defecto
        }
    });

    // POST crear Tarea
    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            title: inputTitle.val(),
            date: inputDate.val(),
            hour: inputHour.val(),
            category: inputCategory.val(),
            subject: inputSubject.val(),
            duration: inputDuration.val()
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

    inputCompleted.on("change", (event) => {
        event.preventDefault();
        let params = {
            id: inputIdtask.val(),
            checkbox: inputCompleted.prop("checked") ? 1 : 0
        };
        $.ajax({
            method: "POST",
            url: "/tareas/marcarCompletada",
            data: params,
            success: (data, statusText, jqXHR) => {
                // Mostrar modal
                showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        });
    });
});


