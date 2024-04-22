"use strict"

// Validación Cliente
function validateParams(params) {
    let error = {};
    let selectedDate = params.date + params.hour;
    // Campos no vacíos
    if (params.font_size === "" || params.theme === "" || params.time_preference === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    else if (params.font_size !== "grande" && params.font_size !== "normal" ) {
        error.code = 400;
        error.title = "Tamaño de fuente mal introducido";
        error.message = "Asegúrate de de que los campos esten marcados.";
        return error;
    }
    else if (params.theme !== "alegre" && params.theme !== "minimalista" ) {
        error.code = 400;
        error.title = "Tema mal introducido";
        error.message = "Asegúrate de de que los campos esten marcados.";
        return error;
    }
    else if (params.time_preference !== "largo" && params.time_preference !== "corto" ) {
        error.code = 400;
        error.title = "Preferencia de tiempo mal introducida";
        error.message = "Asegúrate de de que los campos esten marcados.";
        return error;
    }
    else {
        return null;
    }
}

$(() => {
    // Obtener elementos
    const formConfiguration = document.getElementById("formConfiguration");
    const fontSizeSelect = $("#fontSizeSelect");
    const themeSelect = $("#themeSelect");
    const timeSelect = $("#timeSelect");
    const submitButton = $("#input-sb-updateConfig");


    // POST login
    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            font_size: fontSizeSelect.val(),
            theme: themeSelect.val(),
            time_preference: timeSelect.val()
        };
        // Validar
        let error = validateParams(params);
        if (!error) {
            $.ajax({
                method: "POST",
                url: "/usuario/guardarConfiguracion",
                data: params,
                success: (data, statusText, jqXHR) => {
                    // Aplicar configuración
                    setConfiguration(fontSizeSelect.val());
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


