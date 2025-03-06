document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("datos.json");
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }
        window.jsonData = await response.json();
        cargarOpciones();
    } catch (error) {
        console.error("Error al cargar JSON:", error);
    }

    document.getElementById("registroAlumno").addEventListener("submit", validarFormulario);
    document.getElementById("pais").addEventListener("change", (event) => {
        cargarSelect("ciudad", window.jsonData.ciudades[event.target.value] || []);
    });
});

function cargarOpciones() {
    if (!window.jsonData) {
        console.error("No se han cargado los datos JSON correctamente.");
        return;
    }
    cargarSelect("lenguaMaterna", window.jsonData.lenguas);
    cargarSelect("idiomasConocidos", window.jsonData.idiomas, true);
    cargarSelect("pais", window.jsonData.paises);
    cargarSelect("profesion", window.jsonData.profesiones);
    cargarSelect("nivelEstudios", window.jsonData.nivelesEstudios);
    cargarSelect("idiomasEstudiados", window.jsonData.idiomas, true);
    cargarSelect("nivelEstudioSolicitado", window.jsonData.nivelesEstudios);
    cargarSelect("alergias", window.jsonData.alergias, true);
}

function cargarSelect(id, opciones, multiple = false) {
    const select = document.getElementById(id);
    if (!select) {
        console.error(`Elemento select con id ${id} no encontrado.`);
        return;
    }
    select.innerHTML = "<option value=''>Seleccione una opción</option>";
    opciones.forEach(opcion => {
        const option = document.createElement("option");
        option.value = opcion;
        option.textContent = opcion;
        select.appendChild(option);
    });
    if (multiple) select.setAttribute("multiple", "multiple");
}

function agregarFamiliar() {
    const contenedor = document.getElementById("familiares");
    if (!contenedor) {
        console.error("Contenedor de familiares no encontrado.");
        return;
    }
    if (document.querySelectorAll(".familiar").length >= 1) {
        alert("Solo se permite un familiar.");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("familiar");
    div.innerHTML = `
        <label>Nombre: <input type="text" id="nombreFamiliar" required></label>
        <label>Apellidos: <input type="text" id="apellidosFamiliar" required></label>
        <label>NIF: <input type="text" id="nifFamiliar" required pattern="^[0-9]{8}[A-Za-z]$"></label>
        <label>Profesión: <select id="profesionFamiliar"></select></label>
        <label>Lengua Materna: <select id="lenguaMaternaFamiliar"></select></label>
        <label>Idiomas Conocidos: <select id="idiomasConocidosFamiliar" multiple></select></label>
    `;
    contenedor.appendChild(div);
    cargarSelect("profesionFamiliar", window.jsonData.profesiones || []);
    cargarSelect("lenguaMaternaFamiliar", window.jsonData.lenguas || []);
    cargarSelect("idiomasConocidosFamiliar", window.jsonData.idiomas || [], true);
}

function validarFormulario(event) {
    event.preventDefault();
    try {
        const builder = new AlumnoBuilder()
            .setDatosAlumno(
                document.getElementById("nombreAlumno").value.trim(),
                document.getElementById("apellidosAlumno").value.trim(),
                document.getElementById("nifAlumno").value.trim(),
                document.getElementById("lenguaMaterna").value,
                Array.from(document.getElementById("idiomasConocidos").selectedOptions, opt => opt.value)
            )
            .setDireccion(
                document.getElementById("pais").value,
                document.getElementById("ciudad").value,
                "Población", // No se recoge en el formulario
                "Dirección Completa", // No se recoge en el formulario
                "00000" // No se recoge en el formulario
            )
            .setDatosAcademicos(
                "Colegio de procedencia", // No se recoge en el formulario
                document.getElementById("nivelEstudios").value,
                Array.from(document.getElementById("idiomasEstudiados").selectedOptions, opt => opt.value),
                document.getElementById("nivelEstudioSolicitado").value
            )
            .setInformacionMedica(
                Array.from(document.getElementById("alergias").selectedOptions, opt => opt.value),
                "" // No se recoge en el formulario
            );

        const familiar = document.querySelector(".familiar");
        if (familiar) {
            builder.addFamiliar(
                document.getElementById("nombreFamiliar").value.trim(),
                document.getElementById("apellidosFamiliar").value.trim(),
                document.getElementById("nifFamiliar").value.trim(),
                document.getElementById("profesionFamiliar").value,
                document.getElementById("ciudadNacimientoFamiliar").value,
                document.getElementById("lenguaMaternaFamiliar").value,
                Array.from(document.getElementById("idiomasConocidosFamiliar").selectedOptions, opt => opt.value)
            );
        }

        const alumno = builder.build();
        console.log(alumno.mostrarResumen());
        alert("Formulario enviado correctamente.");
    } catch (error) {
        alert(error.message);
    }
}
