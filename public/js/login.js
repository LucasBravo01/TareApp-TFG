"use strict"

// Validación Cliente
function validateParams(params) {
    let error = {};
    // Campos no vacíos
    if (params.username === "" || params.password === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    else {
        return null;
    }
}

// Cuando cargue el DOM
$(() => {
    const inputUser = $("#input-user");
    const inputPassword = $("#input-password");
    const buttonLogin = $("#button-login");
    const formLogin = $("#form-login");

    // POST Login
    buttonLogin.on("click", (event) => {
        event.preventDefault();
        let params = {
            username: inputUser.val(),
            password: inputPassword.val()
        };
        // Validar
        let error = validateParams(params);
        if (!error) {
            formLogin.submit();
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });
});