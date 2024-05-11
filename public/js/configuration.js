"use strict"

// Validación Cliente
function validateParams(params) {
    let error = {};
    let user = $("body").data("user");
    // Campos no modificados
    if (params.font_size === user.configuration.font_size && params.theme === user.configuration.theme && params.time_preference === user.configuration.time_preference && params.reward === user.configuration.reward_type ) {
        error.code = 400;
        error.title = "Campos no modificados";
        error.message = "Los campos de la configuración no han sido modificados.";
        return error;
    }
    else {
        return null;
    }
}

$(() => {
    // Obtener elementos
    const fontSizeSelect = $("#fontSizeSelect");
    const themeSelect = $("#themeSelect");
    const timeSelect = $("#timeSelect");
    const rewardSelect = $("#rewardSelect");
    const submitButton = $("#input-sb-updateConfig");


    // POST login
    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            font_size: fontSizeSelect.val(),
            theme: themeSelect.val(),
            time_preference: timeSelect.val(),
            reward: rewardSelect.val()
        };
        // Validar
        let error = validateParams(params);
        if (!error) {
            $.ajax({
                method: "POST",
                url: "/usuario/guardarConfiguracion",
                data: params,
                success: (data, statusText, jqXHR) => { // TODO revisar
                    // Reemplazar el archivo CSS actual e imágenes por el nuevo
                    $("#css-link").attr('href', `/css/${themeSelect.val()}/style.css`);
                    $("#img-nav-burger").attr('src', `/images/${themeSelect.val()}/menu.png`);
                    $("#img-nav-calendar").attr('src', `/images/${themeSelect.val()}/calendar.png`);
                    $("#img-nav-notifications").attr('src', `/images/${themeSelect.val()}/notifications.png`);
                    $("#img-nav-settings").attr('src', `/images/${themeSelect.val()}/settings.png`);
                    $("#img-nav-logout").attr('src', `/images/${themeSelect.val()}/logout.png`);
                    
                    const user = $("body").data("user");
                    if(!user.hasProfilePic) {
                        $("#img-nav-profile").attr('src', `/images/${themeSelect.val()}/default-user.png`);
                    }

                    let params = {
                        id_user: user.id,
                        font_size: fontSizeSelect.val(),
                        theme: themeSelect.val(),
                        time_preference: timeSelect.val(),
                        reward: rewardSelect.val(),
                    };

                    user.configuration.font_size = params.font_size;
                    user.configuration.theme = params.theme;
                    user.configuration.time_preference = params.time_preference;
                    user.reward = params.reward;

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


