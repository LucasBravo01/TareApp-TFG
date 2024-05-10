"use strict"

// VARIABLES TEMPORIZADOR
let studyTime = 5 * 60;
let brakeTime;
let numSlots;
let longBrakeTime;
let numLongBrakeSlots;
let timeLeft = studyTime;
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
    timeLeft = studyTime;

    $("#div-minsTimer").text(formatTime(studyTime / 60));
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
    // Elementos HTML
    const inputStudySession = $("#input-study-session");
    const inputName = $("#input-name");
    const divInputName = $("#div-input-name");
    const inputStudySlot = $("#input-study-slot");
    const inputBrakeSlot = $("#input-brake-slot");
    const inputNumberSlots = $("#input-number-slots");
    const inputLongBrakeSlot = $("#input-long-brake-slot");
    const inputNumberLongBrakeSlot = $("#input-number-long-brake-slots");
    const buttonStartStudySession = $("#input-sb-selectStudySession");
    const buttonCreateStudySession = $("#input-sb-createStudySession");

    const studySessions = $("body").data("studySessions");

    inputStudySession.on("change", () => {
        let selectedSession = inputStudySession.val();

        if (selectedSession === "Nueva") {
            inputName.val("");
            inputStudySlot.val("");
            inputBrakeSlot.val("");
            inputNumberSlots.val("");
            inputLongBrakeSlot.val("");
            inputNumberLongBrakeSlot.val("");

            divInputName.prop("style", "display: block;");
            inputStudySlot.prop("disabled", false);
            inputBrakeSlot.prop("disabled", false);
            inputNumberSlots.prop("disabled", false);
            inputLongBrakeSlot.prop("disabled", false);
            inputNumberLongBrakeSlot.prop("disabled", false);
            buttonCreateStudySession.prop("disabled", false);
        } else {
            let session = studySessions[selectedSession];

            inputStudySlot.val(session.study_slot);
            inputBrakeSlot.val(session.brake_slot);
            inputNumberSlots.val(session.num_slots);
            inputLongBrakeSlot.val(session.long_brake_slot);
            inputNumberLongBrakeSlot.val(session.num_long_slots);

            divInputName.prop("style", "display: none;")
            inputStudySlot.prop("disabled", true);
            inputBrakeSlot.prop("disabled", true);
            inputNumberSlots.prop("disabled", true);
            inputLongBrakeSlot.prop("disabled", true);
            inputNumberLongBrakeSlot.prop("disabled", true);
            buttonCreateStudySession.prop("disabled", true);
        }
    });

    buttonStartStudySession.on("click", (event) => {
        event.preventDefault();

        studyTime = inputStudySlot.val();
        brakeTime = inputBrakeSlot.val();
        numSlots = inputNumberSlots.val();
        longBrakeTime = inputLongBrakeSlot.val();
        numLongBrakeSlots = inputNumberLongBrakeSlot.val();
    })
});