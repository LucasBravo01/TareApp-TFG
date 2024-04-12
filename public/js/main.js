// JS General

// TODO Descomentar cuando se necesite
//Configurar SW
// let swLocation = "sw.js";

// if (navigator.serviceWorker) {
//   if (window.location.href.includes("localhost")) swLocation = "../sw.js"; //Varia según el host
//   navigator.serviceWorker.register(swLocation);
// }

// Mostrar el modal con respuesta/error
function showModal(response, header, img, title, message, button, modal) {
    // Título y mensaje
    title.text(response.title);
    message.text(response.message);
    // Success
    if (response.code === 200) {
        // Crear modal
        header.removeClass("bg-ta-light-gray");
        header.addClass("bg-ta-light-green");
        img.attr("src", "/images/iconos/success.png");
        img.attr("alt", "Icono de éxito");
        button.removeClass("bg-ta-red");
        button.addClass("bg-ta-green");
    }
    // Error
    else {
        title.text(response.title);
        message.text(response.message);
        header.removeClass("bg-ta-light-green");
        header.addClass("bg-ta-light-gray");
        img.attr("src", "/images/iconos/error.png");
        img.attr("alt", "Icono de error");
        button.removeClass("bg-ta-green");
        button.addClass("bg-ta-red");
    }
    // Abrir modal
    modal.click();
}

// Cuando cargue el DOM
$(() => {
    // Comprobar al cargar la página si hay un mensaje que mostrar
    const response = $("body").data("response");

    if (response) {
        showModal(response, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
    }

    // Logout
    const buttonLogout = $("#a-logout");
    const formLogout = $("#form-logout");
    buttonLogout.on("click", () => {
        formLogout.submit();
    });
});