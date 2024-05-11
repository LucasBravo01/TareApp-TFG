"use strict"

// VARIABLES TEMPORIZADOR
// Parámetros de la sesión de estudio
let studyTime;
let brakeTime;
let numSlots;
let longBrakeTime;
let numLongBrakeSlots;

// Variables de funcionalidad
let timeLeft;
let contSlots = 0;
let isStudytime = true;
let control;

// FUNCIONALIDAD TEMPORIZADOR
function initializeTimer(params) {
    studyTime = params.study_slot * 60;
    brakeTime = params.brake_slot * 60;
    numSlots = params.num_slots;
    timeLeft = studyTime;

    if(params.long_brake_slot !== "") {
        longBrakeTime = params.long_brake_slot * 60;
        numLongBrakeSlots = params.num_long_slots;
    }

    $("#span-minsTimer").text(formatTime(studyTime / 60));
    $("#span-whichPeriod").text("Periodo de estudio");
    $("#span-numSlot").text("Número de periodo: " + contSlots);
    $("#div-form-studySession").hidden();
    $("#div-timer").show();
    $("#div-tasks").show();
}

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

    $("#span-minsTimer").text(formatTime(studyTime / 60));
    $("#span-secsTimer").text("00");

    $("#input-startTimer").removeAttr("disabled");
    $("#input-stopTimer").attr("disabled", true);
    $("#input-resumeTimer").attr("disabled", true);
    $("#input-resetTimer").attr("disabled", true);
}

function timer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    $("#span-minsTimer").text(formatTime(minutes));
    $("#span-secsTimer").text(formatTime(seconds));

    if(timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(control);

        if (isStudytime) {
            contSlots++;
            isStudytime = false;
            $("#span-whichPeriod").text("Periodo de descanso");
            $("#span-numSlot").text("Número de periodo: " + contSlots);

            if(contSlots !== numSlots) {
                if (longBrakeTime !== "" && contSlots % numLongBrakeSlots === 0) {
                    timeLeft = longBrakeTime;
                } 
                else{
                    timeleft = brakeTime;
                }
                startTimer();
            }
        }
        else {
            isStudytime = true;
            timeleft = studyTime;
            $("#span-whichPeriod").text("Periodo de estudio");
            startTimer();
        }
    }
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

// FUNCIONALIDAD FORMULARIO
function validateParams(params) {
    // Campos no vacíos
    if(params.name === "" || params.study_slot === "" || params.brake_slot === "" || params.num_slots === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Si se pone un descanso largo indicar número de slots de descansos largos
    else if (params.long_brake_slot !== "" && params.num_long_slots === "") {
        error.code = 400;
        error.title = "Campos vacíos de periodo largo";
        error.message = "Asegúrate de rellenar todos los campos de los periodos largos.";
        return error;
    }
    // El número de slots de descansos largos tiene que ser menor al número de slots de descansos
    else if (params.num_long_slots > params.num_slots) {
        error.code = 400;
        error.title = "Periodos de descansos largos no válidos";
        error.message = "El número de periodos de descansos largos tiene que ser menor al número de periodos de descansos.";
        return error;
    }
    else {
        return null;
    }
}

$(() => {
    // Elementos HTML
    const inputStudySession = $("#input-study-session");
    const inputName = $("#input-name");
    const inputStudySlot = $("#input-study-slot");
    const inputBrakeSlot = $("#input-brake-slot");
    const inputNumberSlots = $("#input-number-slots");
    const inputLongBrakeSlot = $("#input-long-brake-slot");
    const inputNumberLongBrakeSlot = $("#input-number-long-brake-slots");

    const buttonStartStudySession = $("#input-sb-selectStudySession");
    const buttonCreateStudySession = $("#input-sb-createStudySession");

    const studySessions = $("body").data("sessions");

    inputStudySession.on("change", () => {
        let selectedSession = inputStudySession.val();

        if (selectedSession === "Nueva") {
            inputName.val("");
            inputStudySlot.val("");
            inputBrakeSlot.val("");
            inputNumberSlots.val("");
            inputLongBrakeSlot.val("");
            inputNumberLongBrakeSlot.val("");

            inputName.prop("disabled", false);
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

            inputName.prop("disabled", true);
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

        let params = {
            study_slot: inputStudySlot.val(),
            brake_slot: inputBrakeSlot.val(),
            long_brake_slot: inputLongBrakeSlot.val(),
            num_slots: inputNumberSlots.val(),
            num_long_slots: inputNumberLongBrakeSlot.val()
        }

        initializeTimer(params);
    });

    buttonCreateStudySession.on("click", (event) => {
        event.preventDefault();

        let params = {
            name: inputName.val(),
            study_slot: inputStudySlot.val(),
            brake_slot: inputBrakeSlot.val(),
            long_brake_slot: inputLongBrakeSlot.val(),
            num_slots: inputNumberSlots.val(),
            num_long_slots: inputNumberLongBrakeSlot.val()
        }

        let error = validateParams(params);
        if(!error) {
            $.ajax({
                method: "POST",
                url: "/sesionEstudio/nuevaSesionEstudio",
                data: params,
                success: (data, statusText, jqXHR) => {
                    // Mostrar modal
                    showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                }
            });
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }

        initializeTimer(params);
    });
});