"use strict"

// Cuando cargue el DOM
$(() => {
    const todaySection = $("#div-today-notifications");
    const pastSection = $("#div-past-notifications");
    const todayNotifications = todaySection.next("div.card-notification");
    const pastNotifications = pastSection.next("div.card-notification");

    if (todayNotifications.length === 0) {
        todaySection.after(`<div class="col-12 text-center mt-3"><p>No hay notificaciones de hoy</p> </div>`);
    }

    if (pastNotifications.length === 0) {
        pastSection.after(`<div class="col-12 text-center mt-3"><p>No hay notificaciones pasadas</p> </div>`);
    }

    // POST marcar mensaje como leído (AJAX)
    $.ajax({
        method: "POST",
        url: "/recordatorio/marcarLeido",
        data: {},
        success: (data, statusText, jqXHR) => {
            $("#span-num-notifications").addClass("d-none");
        },
        error: (jqXHR, statusText, errorThrown) => {
            showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });
});