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
    studyTime = params.studySlot * 60;
    brakeTime = params.brakeSlot * 60;
    numSlots = params.numSlots;
    timeLeft = studyTime;

    if(params.longBrakeSlot !== "") {
        longBrakeTime = params.longBrakeSlot * 60;
        numLongBrakeSlots = params.numLongSlots;
    }

    $("#span-minsTimer").text(formatTime(studyTime / 60));
    $("#span-whichPeriod").html("&#128214;");
    $("#span-numSlot").text("Periodo actual: " + contSlots);
    $(".div-timer").removeClass("rest-timer");

    $("#form-studySession").hide();
    $("#accordion-StudySessionList").addClass("d-none");
    $("#div-newStudySessionButton").hide();
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
    $("#span-whichPeriod").html("&#128214;");
    $("#span-numSlot").text("Periodo actual: " + contSlots);
    $(".div-timer").removeClass("rest-timer");

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
                    $("#span-whichPeriod").html("&#128164;");;
                    $("#span-numSlot").text("Siguiente periodo: " + contSlots);
                    $(".div-timer").addClass("rest-timer");
                } 
                else{
                    timeLeft = brakeTime;
                    $("#span-whichPeriod").html("&#128164;");;
                    $("#span-numSlot").text("Siguiente periodo: " + contSlots);
                    $(".div-timer").addClass("rest-timer");
                }
                startTimer();
            }
            else {
                $("#span-whichPeriod").html("&#9989;");
                $("#span-numSlot").text("");
                resetTimer();
            }
        }
        else {
            isStudytime = true;
            timeLeft = studyTime;
            $("#span-whichPeriod").html("&#128214;");
            $("#span-numSlot").text("Periodo actual: " + contSlots);
            $(".div-timer").removeClass("rest-timer");
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
    if(params.name === "" || params.studySlot === "" || params.brakeSlot === "" || params.numSlots === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Si se pone un descanso largo indicar número de slots de descansos largos
    else if (params.longBrakeSlot !== "" && params.numLongSlots === "") {
        error.code = 400;
        error.title = "Campos vacíos de periodo largo";
        error.message = "Asegúrate de rellenar todos los campos de los periodos largos.";
        return error;
    }
    // El número de slots de descansos largos tiene que ser menor al número de slots de descansos
    else if (params.numLongSlots > params.numSlots) {
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
                showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"), data.image);
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        });
}

$(() => {
    // ELEMENTOS HTML
    // Elementos listar sesiones de estudio
    const divNewStudySessionButton = $("#div-newStudySessionButton");
    const divStudySessionsList = $("#accordion-StudySessionList");
    
    const buttonNewStudySession = $("#input-sb-newStudySession");
    const buttonsStartStudySession = $(".button-startStudySession");

    // Elementos formulario
    const formStudySession = $("#form-studySession");
    const inputName = $("#input-name");
    const inputStudySlot = $("#input-study-slot");
    const inputBrakeSlot = $("#input-brake-slot");
    const inputNumberSlots = $("#input-number-slots");
    const inputLongBrakeSlot = $("#input-long-brake-slot");
    const inputNumberLongBrakeSlot = $("#input-number-long-brake-slots");
    const buttonCreateStudySession = $("#input-sb-createStudySession");

    // Elementos listar tareas
    const checkBoxes = $(".checkbox-completedTask");

    // Nueva sesión de estudio -> formulario vacio
    buttonNewStudySession.on("click", (event) => {
        event.preventDefault();
        console.log("New");
        console.log("Div:", divStudySessionsList);

        divNewStudySessionButton.hide();
        divStudySessionsList.addClass("d-none");
        formStudySession.show();
    });

    // Iniciar sesión de estudio existente
    buttonsStartStudySession.each(function(i, button) {
        $(button).on("click", (event) => {
            event.preventDefault();
            let data = $(button).data("studysession");

            let params = {
                studySlot: data.studySlot,
                brakeSlot: data.brakeSlot,
                longBrakeSlot: data.longBrakeSlot,
                numSlots: data.numSlots,
                numLongSlots: data.numLongSlots
            }

        let error = validateParams(params);
        if(!error) {
            initializeTimer(params);
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
        });
    });

    // Crear e iniciar sesión de estudio
    buttonCreateStudySession.on("click", (event) => {
        event.preventDefault();

        let params = {
            name: inputName.val(),
            studySlot: inputStudySlot.val(),
            brakeSlot: inputBrakeSlot.val(),
            longBrakeSlot: 0,
            numSlots: inputNumberSlots.val(),
            numLongSlots: 0
        }

        if(inputLongBrakeSlot.val() !== "") {
            params.longBrakeSlot = inputLongBrakeSlot.val();
            params.numLongSlots = inputNumberLongBrakeSlot.val();
        }

        let error = validateParams(params);
        if(!error) {
            params.studySlot = parseInt(inputStudySlot.val());
            params.brakeSlot = parseInt(inputBrakeSlot.val());
            params.longBrakeSlot = parseInt(inputLongBrakeSlot.val());
            params.numSlots = parseInt(inputNumberSlots.val());
            params.numLongSlots = parseInt(inputNumberLongBrakeSlot.val());

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

    // Completar tareas
    checkBoxes.each(function(i, check) {
        $(check).on("change", () => {
            let id = $(check).data("task").id;
            completeTask(id);
        });
    });
});