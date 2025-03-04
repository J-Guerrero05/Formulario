document.addEventListener("DOMContentLoaded", () => {
    fetch("datos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo JSON");
            }
            return response.json();
        })
        .then(data => {
            window.jsonData = data;
            cargarOpciones();
        })
        .catch(error => console.error("Error al cargar JSON:", error));

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
        <label>Nombre: <input type="text" required></label>
        <label>Apellidos: <input type="text" required></label>
        <label>NIF: <input type="text" required pattern="^[0-9]{8}[A-Za-z]$"></label>
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
    const nombre = document.getElementById("nombreAlumno").value.trim();
    const apellidos = document.getElementById("apellidosAlumno").value.trim();
    const nif = document.getElementById("nifAlumno").value.trim();
    const regexNIF = /^[0-9]{8}[A-Za-z]$/;
    
    if (!nombre || !apellidos || !regexNIF.test(nif)) {
        alert("Por favor, rellene los campos obligatorios con datos válidos.");
        return;
    }
    
    alert("Formulario enviado correctamente.");
}
