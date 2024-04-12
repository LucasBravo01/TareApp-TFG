///////////////////////
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
    const response = await fetch('/save-suscription', {
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

document.getElementById('subscribeButton').addEventListener('click', subscribeToNotifications);

////////////////////////
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('createTask-button').addEventListener('click', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById('formTask'));
    console.log('En el main');
    console.log(`Tema: ${formData.get('theme')}`);
    console.log(`Fecha: ${formData.get('date')}`);
    try {
      const response = await fetch('/prototipe/save-task', {
        method: 'POST',
        body: JSON.stringify({
          theme: formData.get('theme'),
          date: formData.get('date')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Tarea creada exitosamente!!');
        document.getElementById('date').value = ''; // Limpiar el campo de fecha
      } else {
        throw new Error('Error al crear la tarea');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Ocurrió un error al crear la tarea');
    }
  });
});

//Logic of web app
console.log("Hello world!!");
