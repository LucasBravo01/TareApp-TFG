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

function getDayName(date) {
    let dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dayNames[date.getDay()];
}

function getDailyInfo(date, tasks) {
    let currentDateFormat = formatString(date);

    let hourlyTasks = {};
    for (let hour = 0; hour < 24; hour++) {
        hourlyTasks[hour] = [];
    }

    if (tasks) {
        tasks.forEach(task => {
            if (formatDate(task.date) === date) {
                hourlyTasks[parseInt(task.time.split(':')[0])].push(task);
            }
        });
    }

    let day = {
        dayName: getDayName(currentDateFormat),
        dayNumber: currentDateFormat.getDate(),
        date: date
    }

    return { day: day, tasks: hourlyTasks }
}

function getWeeklyInfo(date, tasks) {
    let currentDateFormat = formatString(date);

    let startOfWeek = new Date(currentDateFormat);
    startOfWeek.setDate(currentDateFormat.getDate() - currentDateFormat.getDay());
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    let week = [];
    for (let date = startOfWeek; date <= endOfWeek; date.setDate(date.getDate() + 1)) {
        let dailyTasks = tasks.filter(task => {
            let taskDate = new Date(task.date);
            return taskDate.getFullYear() === date.getFullYear() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getDate() === date.getDate();
        });

        dailyTasks.sort((a, b) => a.time.localeCompare(b.time));

        week.push({
            dayName: getDayName(date),
            dayNumber: date.getDate(),
            date: formatDate(date),
            tasks: dailyTasks
        });
    }

    return week;
}

module.exports = {
    formatDate: formatDate,
    formatHour: formatHour,
    formatString: formatString,
    getDayName: getDayName,
    getDailyInfo: getDailyInfo,
    getWeeklyInfo: getWeeklyInfo
};