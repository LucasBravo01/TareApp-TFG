//Logic of web app
console.log("Gestor tareas!!");

document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/prototipe/get-tasks');
      if (response.ok) {
        const data = await response.json();
        const subjects = data.resultado;
        console.log('Asignaturas obtenidas:', subjects);
        // Aquí puedes manejar los datos de las asignaturas, como mostrarlos en la página
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = ''; // Vaciar el contenido existente
       // Construir la tabla HTML con Bootstrap
        var tableHTML = `
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
        subjects.forEach(subject => {
          var formattedDate = new Date(subject.date).toLocaleDateString('es-ES');

            tableHTML += `
                <tr>
                    <td style="background-color: white;">${subject.id}</td>
                    <td style="background-color: white;">${subject.name}</td>
                    <td style="background-color: white;">${formattedDate}</td>
                </tr>
            `;
        });

        tableHTML += `
        </tbody>
        </table>
    </div>`;

        // Asignar la tabla HTML a tareasList.innerHTML
        tasksList.innerHTML = tableHTML;

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
