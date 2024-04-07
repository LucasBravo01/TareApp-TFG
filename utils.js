"use strict"

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // En JavaScript los meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatHour(hour) {
    const parts = hour.split(':');
    const formattedHour = parts[0] + ':' + parts[1];

    return formattedHour;
}


module.exports = {
    formatDate: formatDate,
    formatHour: formatHour
};