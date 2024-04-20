'use strict'

// Cuando cargue el DOM
$(() => {
    // POST marcar mensaje como leído (AJAX)
    $.ajax({
        method: "POST",
        url: "/usuario/marcarLeido",
        data: {},
        success: (data, statusText, jqXHR) => {
            $("#span-num-notifications").addClass("d-none");
        },
        error: (jqXHR, statusText, errorThrown) => {
            showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });
});