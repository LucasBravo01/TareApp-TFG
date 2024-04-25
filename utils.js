"use strict"

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // En JavaScript los meses van de 0 a 11
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function formatHour(hour) {
    const parts = hour.split(':');
    const formattedHour = parts[0] + ':' + parts[1];

    return formattedHour;
}

function formatString(date) {
    let dateParts = date.split('-');
    let newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return newDate
}

function getDayName(date){
    let dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dayNames[date.getDay()];
}

module.exports = {
    formatDate: formatDate,
    formatHour: formatHour,
    formatString: formatString,
    getDayName: getDayName
};