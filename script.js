document.addEventListener("DOMContentLoaded", function() {
    const verMasProyectosBtn = document.getElementById("ver-mas-proyectos");
    const hiddenProyectos = document.querySelectorAll(".ocultar-proyect");

    verMasProyectosBtn.addEventListener("click", function() {
        hiddenProyectos.forEach(proyecto => {
            proyecto.classList.toggle("visible");
        });

        // Verificar si hay proyectos visibles después de hacer click
        const proyectosVisibles = document.querySelectorAll(".ocultar-proyect.visible");

        if (proyectosVisibles.length > 0) {
            // Si hay proyectos visibles, cambia el texto del botón a "Ver menos proyectos"
            verMasProyectosBtn.textContent = "Ver menos proyectos";
        } else {
            // Si no hay proyectos visibles, cambia el texto del botón a "Ver más proyectos"
            verMasProyectosBtn.textContent = "Ver más proyectos";
        }
    });
});
