// JS General

// TODO Descomentar cuando se necesite
//Configurar SW
let swLocation = "sw.js";

if (navigator.serviceWorker) {
  if (window.location.href.includes("localhost")) swLocation = "../sw.js"; //Varia según el host
  navigator.serviceWorker.register(swLocation);
}

// Notificaciones
const publicVapidKey = 'BLCnzXg8xUoWfMEHgv6LvbweKvD8gPFnhDFa_itdDK-k7UvZhthfW9KyIRopraMi5mhaXqEMXitX22g-4kJNs7g';

async function subscribeToNotifications() {
  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register('../sw.js');
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
    const response = await fetch('/suscribirse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscription })
    });
    if (!response.ok) {
      throw new Error('Error al enviar la suscripción al servidor');
    }
  } catch (error) {
    console.error('Error al enviar la suscripción al servidor:', error);
  }
}

// Mostrar el modal con respuesta/error
function showModal(response, header, img, title, message, button, modal) {
    // Título y mensaje
    title.text(response.title);
    message.text(response.message);
    // Success
    if (response.code === 200) {
        // Crear modal
        header.removeClass("bg-ta-light-gray");
        header.addClass("bg-ta-light-green");
        img.attr("src", "/images/icons/success.png");
        img.attr("alt", "Icono de éxito");
        button.removeClass("bg-ta-red");
        button.addClass("bg-ta-green");
    }
    // Error
    else {
        title.text(response.title);
        message.text(response.message);
        header.removeClass("bg-ta-light-green");
        header.addClass("bg-ta-light-gray");
        img.attr("src", "/images/icons/error.png");
        img.attr("alt", "Icono de error");
        button.removeClass("bg-ta-green");
        button.addClass("bg-ta-red");
    }
    // Abrir modal
    modal.click();
}

// Cuando cargue el DOM
$(() => {
    // Comprobar al cargar la página si hay un mensaje que mostrar
    const response = $("body").data("response");

    if (response) {
        showModal(response, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
    }

    // Logout
    const buttonLogout = $("#a-logout");
    const formLogout = $("#form-logout");
    buttonLogout.on("click", () => {
        formLogout.submit();
    });
});