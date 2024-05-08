"use strict"

// Variables
var startTime = 5 * 60
var timeLeft = startTime;
var control;

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
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;

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