"use strict"
// JS General

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // En JavaScript los meses van de 0 a 11
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function formatString(date) {
  let dateParts = date.split('-');
  let newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  return newDate
}

//Configurar SW
let swLocation = "/sw.js";

if (navigator.serviceWorker) {
  navigator.serviceWorker.register(swLocation);
}

// Notificaciones
const publicVapidKey = 'BLCnzXg8xUoWfMEHgv6LvbweKvD8gPFnhDFa_itdDK-k7UvZhthfW9KyIRopraMi5mhaXqEMXitX22g-4kJNs7g';

async function subscribeToNotifications() {
  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey
    });
    // Envía la suscripción al servidor
    await sendSubscriptionToServer(subscription);
    console.log('Suscripción exitosa');
  } catch (error) {
    console.error('Error al suscribirse a notificaciones:', error);
  }
}

async function sendSubscriptionToServer(subscription) {
  // Envía la suscripción al servidor
  try {
    const response = await fetch('/recordatorio/suscribirse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscription })
    });
    console.log(response);
    if (!response.ok) {
      showModal({ code: 500, title: "Error al activar las notificaciones", message: "Este dispositivo ya tienes las notificaciones activadas o se ha producido un error." }, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
    }
    else {
      showModal({ code: 200, title: "Notificaciones activadas", message: "A partir de ahora recibirás notificaciones en este dispositivo." }, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
    }
  } catch (error) {
    console.error('Error al enviar la suscripción al servidor:', error);
  }
}

// Mostrar el modal con respuesta/error
function showModal(response, header, img, title, message, button, modal, image) {
  // Título y mensaje
  const bodyImage = $("#img-modal-body")
  title.text(response.title);
  message.text(response.message);
  // Success
  if (response.code === 200) {
    // Crear modal
    img.attr("src", "/images/modals/success.png");
    img.attr("alt", "Icono de éxito");
    if (image) {
      bodyImage.removeClass("d-none");
      bodyImage.attr("src", image);
    }
    else {
      bodyImage.addClass("d-none");
    }
  }
  // Error
  else {
    title.text(response.title);
    message.text(response.message);
    img.attr("src", "/images/modals/error.png");
    img.attr("alt", "Icono de error");

  }
  // Abrir modal
  modal.click();
}

function setConfiguration(textSize) {
  document.body.className = textSize;
}

// Cuando cargue el DOM
$(() => {

  let currentDate = formatDate(new Date());
  $("#a-nav").attr("href", `/diaria/${currentDate}`);
  $("#a-calendar").attr("href", `/diaria/${currentDate}`);

  // Suscribirse cuando hace click
  const subscribeButton = $("#button-subscribe");
  subscribeButton.on("click", () => {
    subscribeToNotifications();
  });

  // Comprobar al cargar la página si hay un mensaje que mostrar
  const response = $("body").data("response");

  if (response) {
    showModal(response, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
  }

  const user = $("body").data("user");
  if(user) {
    setConfiguration(user.configuration.fontSize);
  }

  // Logout
  const buttonLogout = $("#a-logout");
  const formLogout = $("#form-logout");
  buttonLogout.on("click", () => {
    formLogout.submit();
  });
});