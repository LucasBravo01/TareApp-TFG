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
let contSlots = 1;
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
    $("#span-whichPeriod").text("Toca estudiar ¡A por ello!");
    $("#span-numSlot").text("Periodo actual: " + contSlots);

    $("#div-form-studySession").hide();
    $("#div-sb-backToForm").show();
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
    contSlots = 1;
    isStudytime = true;

    $("#span-minsTimer").text(formatTime(studyTime / 60));
    $("#span-secsTimer").text("00");
    $("#span-whichPeriod").text("Toca estudiar ¡A por ello!");
    $("#span-numSlot").text("Periodo actual: " + contSlots);

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
        $('#audio-endTimer')[0].play();

        if (isStudytime) {
            contSlots++;
            isStudytime = false;

            if(contSlots <= numSlots) {
                if (longBrakeTime !== 0 && (contSlots - 1) % numLongBrakeSlots === 0) {
                    timeLeft = longBrakeTime;
                    $("#span-whichPeriod").text("Toca un descanso largo");
                    $("#span-numSlot").text("Siguiente periodo: " + contSlots);
                } 
                else{
                    timeLeft = brakeTime;
                    $("#span-whichPeriod").text("Un descanso merecido");
                    $("#span-numSlot").text("Siguiente periodo: " + contSlots);
                }
                startTimer();
            }
            else {
                $("#span-whichPeriod").text("¡Enhorabuena! Has completado tu sesión de estudio");
                $("#span-numSlot").text("");
                resetTimer();
            }
        }
        else {
            isStudytime = true;
            timeLeft = studyTime;
            $("#span-whichPeriod").text("Toca estudiar ¡A por ello!");
            $("#span-numSlot").text("Periodo actual: " + contSlots);
            startTimer();
        }
    }
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

// FUNCIONALIDAD FORMULARIO
function validateParams(params) {
    let error = {};
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

function completeTask(idTask) {
        let params = {
            id: idTask,
            checkbox: $("#input-completed-" + idTask).prop("checked") ? 1 : 0
        };
        $.ajax({
            method: "POST",
            url: "/sesionEstudio/completarTarea",
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

$(() => {
    // Elementos HTML
    const formStudySession = $("#form-studySession");
    const labelInputName = $("#label-input-name");

    const inputStudySession = $("#input-study-session");
    const inputName = $("#input-name");
    const inputStudySlot = $("#input-study-slot");
    const inputBrakeSlot = $("#input-brake-slot");
    const inputNumberSlots = $("#input-number-slots");
    const inputLongBrakeSlot = $("#input-long-brake-slot");
    const inputNumberLongBrakeSlot = $("#input-number-long-brake-slots");

    const buttonBackToForm = $("#input-sb-backToForm");
    const buttonStartStudySession = $("#input-sb-selectStudySession");
    const buttonCreateStudySession = $("#input-sb-createStudySession");

    const studySessions = $("body").data("sessions");

    inputStudySession.on("change", () => {
        let selectedSession = inputStudySession.val();

        if (selectedSession === "Nueva") {
            formStudySession[0].reset();

            inputName.show();
            labelInputName.show();
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

            inputName.hide();
            labelInputName.hide();
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

        let error = validateParams(params);
        if(!error) {
            params.study_slot = parseInt(inputStudySlot.val());
            params.brake_slot = parseInt(inputBrakeSlot.val());
            params.long_brake_slot = parseInt(inputLongBrakeSlot.val());
            params.num_slots = parseInt(inputNumberSlots.val());
            params.num_long_slots = parseInt(inputNumberLongBrakeSlot.val());

            initializeTimer(params);
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });

    buttonCreateStudySession.on("click", (event) => {
        event.preventDefault();

        let params = {
            name: inputName.val(),
            study_slot: inputStudySlot.val(),
            brake_slot: inputBrakeSlot.val(),
            long_brake_slot: 0,
            num_slots: inputNumberSlots.val(),
            num_long_slots: 0
        }

        if(inputLongBrakeSlot.val() !== "") {
            params.long_brake_slot = inputLongBrakeSlot.val();
            params.num_long_slots = inputNumberLongBrakeSlot.val();
        }

        let error = validateParams(params);
        if(!error) {
            params.study_slot = parseInt(inputStudySlot.val());
            params.brake_slot = parseInt(inputBrakeSlot.val());
            params.long_brake_slot = parseInt(inputLongBrakeSlot.val());
            params.num_slots = parseInt(inputNumberSlots.val());
            params.num_long_slots = parseInt(inputNumberLongBrakeSlot.val());

            $.ajax({
                method: "POST",
                url: "/sesionEstudio/nuevaSesionEstudio",
                data: params,
                success: (data, statusText, jqXHR) => {
                    // Mostrar modal
                    showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                    initializeTimer(params);
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                }
            });
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });
});