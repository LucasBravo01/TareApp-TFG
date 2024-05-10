"use strict"

function scroll(hour8Element){
    if (hour8Element) {
        hour8Element.scrollIntoView();
    }
}

// Cuando cargue el DOM
$(document).ready(() => {
    let currentDate = new Date();
    currentDate = formatDate(currentDate);

    $("#a-home-daily").attr("href", `/diaria/${currentDate}`);
    $("#a-home-week").attr("href", `/semanal/${currentDate}`);

    const day = $("body").data("day");

    if (day) {
        let currentDay = formatString(day.date);

        let previous = new Date(currentDay);
        previous.setDate(previous.getDate() - 1);
        let next = new Date(currentDay);
        next.setDate(next.getDate() + 1);

        let previousDay = formatDate(previous);
        let nextDay = formatDate(next);

        $("#a-previous-day").attr("href", `/diaria/${previousDay}`);
        $("#a-next-day").attr("href", `/diaria/${nextDay}`);

        // CAMBIAR CLASES BOTONES
        $("#a-home-list").removeClass("view-selected-button").addClass("view-non-selected-button");
        $("#a-home-week").removeClass("view-selected-button").addClass("view-non-selected-button");
        $("#a-home-daily").removeClass("view-non-selected-button").addClass("view-selected-button");

        scroll(document.getElementById('8'));
    }

    const week = $("body").data("week");

    if (week) {
        let currentDay = formatString(week[0].date);

        let previous = new Date(currentDay);
        previous.setDate(previous.getDate() - 7);
        let next = new Date(currentDay);
        next.setDate(next.getDate() + 7);

        let previousWeek = formatDate(previous);
        let nextWeek = formatDate(next);

        $("#a-previous-week").attr("href", `/semanal/${previousWeek}`);
        $("#a-next-week").attr("href", `/semanal/${nextWeek}`);

        // CAMBIAR CLASES BOTONES
        $("#a-home-list").removeClass("view-selected-button").addClass("view-non-selected-button");
        $("#a-home-week").removeClass("view-non-selected-button").addClass("view-selected-button");
        $("#a-home-daily").removeClass("view-selected-button").addClass("view-non-selected-button");

        scroll(document.getElementById('8'));
    }

    if (!day && !week) {
        // CAMBIAR CLASES BOTONES
        $("#a-home-list").removeClass("view-non-selected-button").addClass("view-selected-button");
        $("#a-home-week").removeClass("view-selected-button").addClass("view-non-selected-button");
        $("#a-home-daily").removeClass("view-non-selected-button").addClass("view-non-selected-button");
    }
});
