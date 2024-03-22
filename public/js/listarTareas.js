//Logic of web app
console.log("Gestor tareas!!");

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/prototipo/obtener-tareas');
      if (response.ok) {
        const data = await response.json();
        const asignaturas = data.resultado;
        console.log('Asignaturas obtenidas:', asignaturas);
        // Aquí puedes manejar los datos de las asignaturas, como mostrarlos en la página
        const tareasList = document.getElementById('tareas-list');
        tareasList.innerHTML = ''; // Vaciar el contenido existente
       // Construir la tabla HTML con Bootstrap
        var tablaHTML = `
        <div class="table-responsive">
        <table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Titulo</th>
                    <th>Descripcion</th>
                </tr>
            </thead>
            <tbody>`;

        // Iterar sobre cada asignatura y agregar una fila de tabla para cada una
        asignaturas.forEach(asignatura => {
          var fechaFormateada = new Date(asignatura.fecha).toLocaleDateString('es-ES');

            tablaHTML += `
                <tr>
                    <td style="background-color: white;">${asignatura.id}</td>
                    <td style="background-color: white;">${asignatura.nombre}</td>
                    <td style="background-color: white;">${fechaFormateada}</td>
                </tr>
            `;
        });

        tablaHTML += `
        </tbody>
        </table>
    </div>`;

        // Asignar la tabla HTML a tareasList.innerHTML
        tareasList.innerHTML = tablaHTML;

      } else {
        throw new Error('Error al obtener las asignaturas');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Ocurrió un error al obtener las asignaturas');
    }
  });
  










/* Cuando se carga la página
$(document).ready(function() {
    // Realizar una solicitud para obtener las tareas desde el servidor
    $.ajax({
        url: '/obtener-tareas',
        type: 'GET',
        success: function(response) {
            // Manejar la respuesta del servidor
            // Aquí puedes mostrar las tareas en la página
            console.log('Tareas obtenidas:', response);
            // Por ejemplo, puedes iterar sobre las tareas y agregarlas al elemento 'tareas-list'
            /*response.tareas.forEach(function(tarea) {
                $('#tareas-list').append('<div class="card mt-2" style="border: 2px solid #697e8b;">' +
                                            '<div class="card-body">' +
                                                '<h5 class="card-title">' + tarea.titulo + '</h5>' +
                                                '<p class="card-text">' + tarea.descripcion + '</p>' +
                                            '</div>' +
                                        '</div>');
            });/
        },
        error: function(error) {
            console.error('Error al obtener las tareas:', error);
        }
    });
});*/
