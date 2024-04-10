
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener la fecha y hora actual
    var currentDate = new Date();
    var currentDateString = currentDate.toISOString().split('T')[0]; // Formato para input type="date"
    // Establecer la fecha y hora actual como el valor mínimo para los campos de entrada
    document.getElementById("fecha").setAttribute("min", currentDateString);

  // Habilitar asignatura solo si esta selecionado Escolar en Categoria
const categoriaSelect = document.getElementById("categoria");
const asignaturaSelect = document.getElementById("asignatura");

// Añadimos un event listener al cambio de la opción seleccionada en el select de categoría
categoriaSelect.addEventListener("change", function() {
    // Si la opción seleccionada es "Escolar", habilitamos el select de asignatura
    if (categoriaSelect.value === "Escolar") {
        asignaturaSelect.disabled = false;
    } else {
        // Si no, deshabilitamos el select de asignatura y lo reseteamos
        asignaturaSelect.disabled = true;
        asignaturaSelect.selectedIndex = 0; // Esto establece la opción por defecto
    }
});
});


