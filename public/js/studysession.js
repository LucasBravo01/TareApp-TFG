"use strict"

// VARIABLES TEMPORIZADOR
let startTime = 5 * 60;
let timeLeft = startTime;
let control;

// FUNCIONALIDAD TEMPORIZADOR
function startTimer() {
    control = setInterval(timer, 1000);

    $("#input-startTimer").attr("disabled", true);
    $("#input-stopTimer").attr("disabled", false);
    $("#input-resumeTimer").attr("disabled", true);
    $("#input-resetTimer").attr("disabled", false);
}

function stopTimer() {
    clearInterval(control);

    $("#input-startTimer").attr("disabled", true);
    $("#input-stopTimer").attr("disabled", true);
    $("#input-resumeTimer").attr("disabled", false);
    $("#input-resetTimer").attr("disabled", false);
}

function resetTimer() {
    clearInterval(control);
    timeLeft = startTime;

    $("#div-minsTimer").text(formatTime(startTime / 60));
    $("#div-secsTimer").text("00");

    $("#input-startTimer").attr("disabled", false);
    $("#input-stopTimer").attr("disabled", true);
    $("#input-resumeTimer").attr("disabled", true);
    $("#input-resetTimer").attr("disabled", true);
}

function timer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    $("#div-minsTimer").text(formatTime(minutes));
    $("#div-secsTimer").text(formatTime(seconds));

    if(timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(control);
    }
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

// FUNCIONALIDAD FORMULARIO
$(() => {
    const studySessions = $("body").data("studySessions");;
    $('#input-name').change(function() {
        let selectedSession = $(this).val();
        let session = studySessions[selectedSession];

        $('#input-study-slot').val(session.studyTime);
        $('#input-brake-slot').val(session.breakTime);
        $('#input-number-slots').val(session.breakTime);
        $('#input-long-brake-slot').val(session.breakTime);
        $('#input-number-long-brake-slots').val(session.breakTime);
    });
});