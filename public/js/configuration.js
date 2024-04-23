"use strict"

// Validación Cliente
function validateParams(params) {
    let error = {};
    const user = $("body").data("user");
    // Campos no vacíos
    if (params.font_size === "" || params.theme === "" || params.time_preference === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
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
                    // Reemplazar el archivo CSS actual e imágenes por el nuevo
                    $("#css-link").attr('href', `/css/${themeSelect.val()}/style.css`);
                    $("#img-nav-burger").attr('src', `/images/${themeSelect.val()}/menu.png`);
                    $("#img-nav-notifications").attr('src', `/images/${themeSelect.val()}/notifications.png`);
                    $("#img-nav-settings").attr('src', `/images/${themeSelect.val()}/settings.png`);
                    $("#img-nav-logout").attr('src', `/images/${themeSelect.val()}/logout.png`);
                    $("#img-nav-profile").attr('src', `/images/${themeSelect.val()}/default-user.png`);

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


