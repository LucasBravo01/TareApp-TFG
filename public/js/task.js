"use strict"

// Validación Cliente
function validateParams(params, currentDate, task) {
    let taskDate = new Date(`${params.date}T${params.hour}:00`);
    let error = {};
    console.log(params.duration);
    // Campos no vacíos
    if (params.title === "" || params.date === "" || params.hour === "" || params.category === ""|| params.duration === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }//Si quieres modificar y no has hecho ningun cambio
    else if (task !==null && params.title === task.title && params.date === task.date && params.hour === task.time && params.category === task.category&& parseInt(params.duration) === parseInt(task.duration) && params.description === task.description && params.reminder === task.reminder && ((params.subject !== "" && task.idSubject !== null && parseInt(params.subject) === parseInt(task.idSubject)) || (params.subject === "" && task.idSubject === null)) ) {
        error.code = 400;
        error.title = "Campos no modificados";
        error.message = "Los campos de la tarea no han sido modificados.";
        return error;
    }
    // Asignatura vacía cuando categoría es Escolar
    else if (params.category === "Escolar" && params.subject === "") {
        error.code = 400;
        error.title = "Asignatura vacía";
        error.message = "Asegúrate de rellenar la asignatura para una tarea escolar.";
        return error;
    }
    // Comprobar si la fecha y hora son posteriores a la actual
    else if (taskDate <= currentDate) {
        error.code = 400;
        error.title = "Fecha y/o hora no válidas";
        error.message = "Asegúrate de que la fecha y hora no sean anteriores a la actual.";
        return error;
    }
    // Comprobar si la fecha y hora son posteriores a la actual
    else if (params.duration < 1) {
        error.code = 400;
        error.title = "Duración estimada no válida";
        error.message = "Asegúrate de que la duración estimada es mayor a 0.";
        return error;
    }
    else {
        return null;
    }
}

$(() => {
    // Obtener elementos
    const formTask = document.getElementById("form-task");
    const inputTitle = $("#input-title");
    const inputDate = $("#input-date");
    const inputHour = $("#input-hour");
    const selectCategory = $("#select-category");
    const selectSubject = $("#select-subject");
    const selectReminder = $("#select-reminder");
    const textareaDescription = $("#textarea-description");
    const inputDuration = $("#input-duration");
    const buttonCreate = $("#button-sb-create");
    const inputIdtask = $("#input-id-task");
    const inputIdUser = $("#input-id-user");
    const inputCompleted = $("#input-completed");
    const divCompleted = $("#div-completed");
    const buttonModify = $("#button-sb-modify");
    const buttonDelete = $("#button-sb-delete");
    const buttonSave = $("#button-sb-save");
    const buttonCancel = $("#button-sb-cancel");
    // Comprobar si hay tarea que mostrar
    const task = $("body").data("task");

    // Ajustar datos tarea
    if (task.id) {
        // Rellenar campos faltantes
        selectCategory.val(task.category);
        selectSubject.val(task.idSubject);
        selectReminder.val(task.reminder);
        inputDuration.val(task.duration);

        // Deshabilitar campos
        inputTitle.attr("disabled", "true");
        inputDate.attr("disabled", "true");
        inputHour.attr("disabled", "true");
        selectCategory.attr("disabled", "true");
        selectSubject.attr("disabled", "true");
        selectReminder.attr("disabled", "true");
        textareaDescription.attr("disabled", "true");
        inputDuration.attr("disabled", "true");

        //Ocultar Botones
        buttonSave.hide();
        buttonCancel.hide();
    }

    // Obtener la fecha y hora actual
    let currentDate = new Date();
    let currentDateString = currentDate.toISOString().split('T')[0]; // Formato para input type="date"
    // Establecer la fecha y hora actual como el valor mínimo para los campos de entrada
    inputDate.attr("min", currentDateString);

    // Añadimos un event listener al cambio de la opción seleccionada en el select de categoría
    selectCategory.on("change", () => {
        // Si la opción seleccionada es "Escolar", habilitamos el select de asignatura
        if (selectCategory.val() === "Escolar") {
            selectSubject.removeAttr("disabled");
            $('#subject-asterisk').removeClass('d-none'); // Mostrar el asterisco rojo
        } else {
            // Si no, deshabilitamos el select de asignatura y lo reseteamos
            selectSubject.attr("disabled", "true");
            $('#subject-asterisk').addClass('d-none'); // Ocultar el asterisco rojo
            selectSubject.val(""); // Esto establece la opción por defecto
        }
    });

    // POST crear Tarea
    buttonCreate.on("click", (event) => {
        event.preventDefault();
        let params = {
            title: inputTitle.val(),
            date: inputDate.val(),
            hour: inputHour.val(),
            category: selectCategory.val(),
            subject: selectSubject.val(),
            duration: inputDuration.val()
        };
        // Validar
        let error = validateParams(params, currentDate, null);
        if (!error) {
            formTask.submit();
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });

    // POST marcar/desmarcar como completada
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
                showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"), data.image);
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        });
    });

    //Modificar Tarea
    buttonModify.on("click", (event) => {
        //Ocultar Botones y CheckBox
        buttonModify.hide();
        buttonDelete.hide();
        divCompleted.hide();

        //Mostrar Botones
        buttonSave.show();
        buttonCancel.show();

        inputTitle.removeAttr("disabled");
        inputDate.removeAttr("disabled");
        inputHour.removeAttr("disabled");
        selectCategory.removeAttr("disabled");
        if(task.idSubject){
            selectSubject.removeAttr("disabled");
        }
        selectReminder.removeAttr("disabled");
        textareaDescription.removeAttr("disabled");
        inputDuration.removeAttr("disabled");
    });

    //Cancelar Modificar Tarea
    buttonCancel.on("click", (event) => {
        //Mostrar Botones y CheckBox
        buttonModify.show();
        buttonDelete.show();
        divCompleted.show();

        //Ocultar Botones
        buttonSave.hide();
        buttonCancel.hide();

        // Rellenar campos faltantes
        inputTitle.val(task.title);
        inputDate.val(task.date);
        inputHour.val(task.time);
        textareaDescription.val(task.description);
        selectCategory.val(task.category);
        selectSubject.val(task.idSubject);
        selectReminder.val(task.reminder);
        inputDuration.val(task.duration);

        // Deshabilitar campos
        inputTitle.attr("disabled", "true");
        inputDate.attr("disabled", "true");
        inputHour.attr("disabled", "true");
        selectCategory.attr("disabled", "true");
        selectSubject.attr("disabled", "true");
        selectReminder.attr("disabled", "true");
        textareaDescription.attr("disabled", "true");
        inputDuration.attr("disabled", "true");
    });

    // POST modificar Tarea
    buttonSave.on("click", (event) => {
        event.preventDefault();
        let params = {
            title: inputTitle.val(),
            date: inputDate.val(),
            hour: inputHour.val(),
            category: selectCategory.val(),
            subject: selectSubject.val(),
            duration: inputDuration.val(),
            description: textareaDescription.val(),
            reminder: selectReminder.val(),
            id: inputIdUser.val(),
            idTask: inputIdtask.val()
        };
        // Validar
        let error = validateParams(params, currentDate, task);
        if (!error) {
            $.ajax({
                method: "POST",
                url: "/tareas/modificarTarea",
                data: params,
                success: (data, statusText, jqXHR) => {
                    // Deshabilitar campos
                    inputTitle.attr("disabled", "true");
                    inputDate.attr("disabled", "true");
                    inputHour.attr("disabled", "true");
                    selectCategory.attr("disabled", "true");
                    selectSubject.attr("disabled", "true");
                    selectReminder.attr("disabled", "true");
                    textareaDescription.attr("disabled", "true");
                    inputDuration.attr("disabled", "true");
                    
                    //Mostrar Botones y CheckBox
                    buttonModify.show();
                    buttonDelete.show();
                    divCompleted.show();

                    //Ocultar Botones
                    buttonSave.hide();
                    buttonCancel.hide();

                    // Mostrar modal
                    showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                }
            }); 
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });
});


