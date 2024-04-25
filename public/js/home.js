"use strict"

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // En JavaScript los meses van de 0 a 11
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function formatString(date) {
    let dateParts = date.split('-');
    let newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return newDate
}

// Cuando cargue el DOM
$(() => {
    let currentDate = new Date();
    currentDate = formatDate(currentDate);

    $("#a-home-daily").attr("href", `/diaria/${currentDate}`);
    $("#a-home-week").attr("href", `/semanal/${currentDate}`);

    const day = $("body").data("day");

    if(day){
        let currentDay = formatString(day.date);

        let previous = new Date(currentDay);
        previous.setDate(currentDay.getDate() - 1);
        let next = new Date(currentDay);
        next.setDate(currentDay.getDate() + 1);

        let previousDay = formatDate(previous);
        let nextDay = formatDate(next);

        $("#a-previous-day").attr("href", `/diaria/${previousDay}`);
        $("#a-next-day").attr("href", `/diaria/${nextDay}`);

        // CAMBIAR CLASES BOTONES
        $("#a-home-list").attr("class", "me-1 view-non-selected-button");
        $("#a-home-week").attr("class", "me-1 view-non-selected-button");
        $("#a-home-daily").attr("class", "me-1 view-selected-button");
    }

    const week = $("body").data("week");
    
    if (week) {
        let currentDay = formatString(week[0].date);

        let previous = new Date(currentDay);
        previous.setDate(currentDay.getDate() - 7);
        let next = new Date(currentDay);
        next.setDate(currentDay.getDate() + 7);

        let previousWeek = formatDate(previous);
        let nextWeek = formatDate(next);
        
        $("#a-previous-week").attr("href", `/semanal/${previousWeek}`);
        $("#a-next-week").attr("href", `/semanal/${nextWeek}`);

        // CAMBIAR CLASES BOTONES
        $("#a-home-list").attr("class", "me-1 view-non-selected-button");
        $("#a-home-week").attr("class", "me-1 view-selected-button");
        $("#a-home-daily").attr("class", "me-1 view-non-selected-button");
    }

    if(!day && !week) {
        // CAMBIAR CLASES BOTONES
        $("#a-home-list").attr("class", "me-1 view-selected-button");
        $("#a-home-week").attr("class", "me-1 view-non-selected-button");
        $("#a-home-daily").attr("class", "me-1 view-non-selected-button");
    }
});