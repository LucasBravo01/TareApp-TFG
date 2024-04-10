
document.addEventListener('DOMContentLoaded', async () => {

  document.getElementById('crearBtn').addEventListener('click', async (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById('formTarea'));

    try {
      const response = await fetch('/crearTareaForm', {
        method: 'POST',
        body: JSON.stringify({
          titulo: formData.get('titulo'),
          horaInicio: formData.get('horaInicio'),
          fecha: formData.get('fecha'),
          descripcion: formData.get('descripcion'),
          categoria:formData.get('categoria'),
          asignatura:formData.get('asignatura'),
          recordatorios:formData.get('recordatorios'),
          duracion: formData.get('duracion')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Tarea creada exitosamente!!');
        window.location.href = '/crearTarea';// Refrescar ventana
      } else {
        throw new Error('Error al crear la tarea');
      }
    } catch (error) {
      alert('Ocurrió un error al crear la tarea');
    }
  });
});

