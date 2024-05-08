"use strict"

// Variables
var seconds = 0;
var minutes = 0;

var secondsDiv = document.getElementById("div-secsTimer")
var minutesDiv = document.getElementById("div-minsTimer")
var startButton = document.getElementById("input-startTimer");
var stopButton = document.getElementById("input-stopTimer");
var resumeButton = document.getElementById("input-resumeTimer");
var resetButton = document.getElementById("input-resetTimer");

function startTimer() {
    control = setInterval(timer, 1000);

    startButton.disabled = true;
    stopButton.disabled = false;
    resumeButton.disabled = true;
    resetButton.disabled = false;
}

function stopTimer() {
    clearInterval(control);

    startButton.disabled = true;
    stopButton.disabled = true;
    resumeButton.disabled = false;
    resetButton.disabled = false;
}

function resetTimer() {
    clearInterval(control);

    secondsDiv.innerHTML = "00";
    minutesDiv.innerHTML = "00";

    startButton.disabled = false;
    stopButton.disabled = true;
    resumeButton.disabled = true;
    resetButton.disabled = true;
}

function timer() {
    if (seconds > 0) {
        seconds--;

        if(seconds < 10) {
            seconds = "0" + seconds;
        }

        secondsDiv.innerHTML = seconds;
    }

    if (seconds == 0) {
        seconds = 60;
    }

    if (seconds == 60) {
        minutes--;

        if(minutes < 10) {
            minutes = "0" + minutes;
        }

        minutesDiv.innerHTML = minutes;
    }

    if (minutes == 0) {
        clearInterval(control);
    }
}