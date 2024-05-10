"use strict"

// VARIABLES TEMPORIZADOR
let startTime = 5 * 60;
let timeLeft = startTime;
let control;

// FUNCIONALIDAD TEMPORIZADOR
function startTimer() {
    control = setInterval(timer, 1000);

    $("#input-startTimer").attr("disabled", true);
    $("#input-stopTimer").removeAttr("disabled");
    $("#input-resumeTimer").attr("disabled", true);
    $("#input-resetTimer").removeAttr("disabled");
}

function stopTimer() {
    clearInterval(control);

    $("#input-startTimer").attr("disabled", true);
    $("#input-stopTimer").attr("disabled", true);
    $("#input-resumeTimer").removeAttr("disabled");
    $("#input-resetTimer").removeAttr("disabled");
}

function resetTimer() {
    clearInterval(control);
    timeLeft = startTime;

    $("#div-minsTimer").text(formatTime(startTime / 60));
    $("#div-secsTimer").text("00");

    $("#input-startTimer").removeAttr("disabled");
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
    const studySessions = $("body").data("studySessions");

    // Elementos HTML
    const inputStudySession = $("#input-study-session");
    const inputName = $("#input-name");
    const divInputName = $("#div-input-name");
    const inputStudySlot = $("#input-study-slot");
    const inputBrakeSlot = $("#input-brake-slot");
    const inputNumberSlots = $("#input-number-slots");
    const inputLongBrakeSlot = $("#input-long-brake-slot");
    const inputNumberLongBrakeSlot = $("#input-number-long-brake-slots");
    const buttonCreateStudySession = $("input-sb-createStudySession");

    inputStudySession.on("change", () => {
        let selectedSession = inputStudySession.val();

        if (selectedSession === "Nueva") {
            inputName.val("");
            inputStudySlot.val("");
            inputBrakeSlot.val("");
            inputNumberSlots.val("");
            inputLongBrakeSlot.val("");
            inputNumberLongBrakeSlot.val("");

            divInputName.attr("style", "display: block;")
            inputStudySlot.removeAttr("disabled");
            inputBrakeSlot.removeAttr("disabled");
            inputNumberSlots.removeAttr("disabled");
            inputLongBrakeSlot.removeAttr("disabled");
            inputNumberLongBrakeSlot.removeAttr("disabled");
            buttonCreateStudySession.removeAttr("disabled");
        } else {
            let session = studySessions[selectedSession];

            inputStudySlot.val(session.study_slot);
            inputBrakeSlot.val(session.brake_slot);
            inputNumberSlots.val(session.num_slots);
            inputLongBrakeSlot.val(session.long_brake_slot);
            inputNumberLongBrakeSlot.val(session.num_long_slots);

            divInputName.attr("style", "display: none;")
            inputStudySlot.attr("disabled", true);
            inputBrakeSlot.attr("disabled", true);
            inputNumberSlots.attr("disabled", true);
            inputLongBrakeSlot.attr("disabled", true);
            inputNumberLongBrakeSlot.attr("disabled", true);
            buttonCreateStudySession.attr("disabled", true);
        }
    });
});