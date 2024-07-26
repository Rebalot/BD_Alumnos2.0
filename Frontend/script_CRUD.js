const urlSrc = 'http://localhost:3000';

const urlAlumnos = `${urlSrc}/alumnos`;

document.addEventListener('DOMContentLoaded', ()=>{
    obtenerYMostrarAlumnos();
    obtenerYMostrarGrupos();
});

async function obtenerYMostrarAlumnos(alumnoBuscado) {
    console.log(`alumnoBuscado: ${alumnoBuscado}`);
    const newUrl = !alumnoBuscado ? urlAlumnos : `${urlAlumnos}?name=${alumnoBuscado}`;
    console.log(`newURL: ${newUrl}`);
    try {
        const response = await fetch(newUrl);
        if (!response.ok) {
            throw new Error('Error al obtener la lista de alumnos');
        }
        const alumnosObtenidos = await response.json();
        mostrarAlumnosEnTabla(alumnosObtenidos);
        console.log('Alumnos obtenidos correctamente: ', alumnosObtenidos);
    } catch (error) {
        console.error('Error al obtener y mostrar alumnos:', error);
    }
}

async function crearAlumno(nombre, apellido1, apellido2, fechaNacimiento) {
    try {
        const response = await fetch(urlAlumnos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, apellido1, apellido2, fechaNacimiento }),
        });
        if (!response.ok) {
            throw new Error('Error al crear alumno');
        }
        const nuevoAlumno = await response.json();
        await obtenerYMostrarAlumnos();
        console.log('Nuevo alumno creado:', nuevoAlumno);
    } catch (error) {
        console.error('Error al crear alumno:', error);
    }
}

async function eliminarAlumno(matricula) {
    try {
        const response = await fetch(`${urlAlumnos}/${matricula}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar alumno con matrícula ${matricula}`);
        }
        await obtenerYMostrarAlumnos(); // Actualizar la tabla después de eliminar
        console.log(`Alumno con matrícula ${matricula} eliminado correctamente`, );
    } catch (error) {
        console.error(`Error al eliminar alumno con matrícula ${matricula}:`, error);
    }
}
function confirmarEliminarAlumno(matricula) {
    if (confirm(`¿Estás seguro de eliminar al alumno con matrícula ${matricula}?`)) {
        eliminarAlumno(matricula);
    }
}
function mostrarAlumnosEnTabla(alumnos) {
    const tablaContenedor = document.querySelector('#tabla_alumnos tbody');
    tablaContenedor.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos datos

    alumnos.forEach(alumno => {
        tablaContenedor.insertAdjacentHTML('beforeend', `
            <tr row_id='${alumno.matricula}'>
                <th scope="row" class="row_data align-middle" col_name="matricula">${alumno.matricula}</th>
                <td class="row_data align-middle" col_name="nombre">${alumno.nombre}</td>
                <td class="row_data align-middle" col_name="apellido1">${alumno.apellido1}</td>
                <td class="row_data align-middle" col_name="apellido2">${alumno.apellido2}</td>
                <td class="row_data align-middle" col_name="fechaNacimiento">${alumno.fechaNacimiento}</td>
                <td class="align-middle" col_name="edad">${alumno.edad}</td>
                <td class="align-middle" col_name="grupo"><a href="">N/A</a></td>
                <td class="align-middle" col_name="materias"><a href="">N/A</a></td>
                <td class="align-middle" col_name="calificaciones"><a href="">N/A</a></td>
                <td class="row_edit">
                    <div>
                        <span class="btn_edit">
                            <a href="#" class="btn btn-link btn_edit" row_id='${alumno.matricula}'> Edit</a>
                        </span>
                        <span class="btn_save" style="display: none;">
                            <a href="#" class="btn btn-link btn_save" row_id='${alumno.matricula}'> Save</a>
                        </span>
                        <span class="btn_cancel" style="display: none;">
                            <a href="#" class="btn btn-link btn_cancel" row_id='${alumno.matricula}'> Cancel</a>
                        </span>
                    </div>
                    <div class="btn_delete_contenedor">
                        <span class="btn_delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(160, 178, 192)" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                        </svg>
                        </span>
                    </div>
                </td>
            </tr>
        `);
    });
}

async function buscarAlumnoPorMatricula(matricula){
        try {
            const response = await fetch(`${urlAlumnos}/${matricula}`);
            if (!response.ok) {
                throw new Error(`Error al obtener al alumno con matrícula ${matricula}`);
            }
            const alumno = await response.json();
            return alumno;
        } catch (error) {
            console.error(`Error al obtener y mostrar al alumno con matrícula ${matricula}:`, error);
        }
}
async function editarAlumno(matricula, datosAlumno) {
    console.log(matricula,datosAlumno)
    try {
        const response = await fetch(`${urlAlumnos}/${matricula}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosAlumno),
        });
        if (!response.ok) {
            throw new Error(`Error al modificar alumno con matrícula ${matricula}`);
        }
        const alumnoModificado = await response.json();
        await obtenerYMostrarAlumnos(); // Actualizar la tabla después de editar
        console.log('Se modificó al alumno:', alumnoModificado);
    } catch (error) {
        console.error(`Error al modificar alumno con matrícula ${matricula}:`, error);
    }
}
    
///////////////////////////////////
function pausa(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
//boton agregar_alumno toggle
ocultarMostrar('.agregar_alumno button', '.agregar_alumno_datos')

tabActive('#navTabs ul', 'li', '.tab-content')
mainSection(2, '.tab-content');

function mainSection(indice, sectionDiv){
    const sections = document.querySelectorAll(sectionDiv)

    sections.forEach(function(section) {
        section.classList.add('hide')
    })
    
    sections[indice].classList.remove('hide')
}

//Nav tabs comportamiento
function tabActive(tabsDiv, tabsChildsDiv, mostrarSeccion){
    const contenedorAll = document.querySelector(tabsDiv),
        contenedorAllChilds = contenedorAll.querySelectorAll(tabsChildsDiv);

    contenedorAllChilds.forEach(function(child, indice){
        child.addEventListener('click',() =>{
            contenedorAll.querySelector('.active').classList.remove('active');
            child.classList.add('active');
            mainSection(indice, mostrarSeccion)
        })
    });
}

function ocultarMostrar(eventList, div){
    //ocultar mostrar mediante toggle, para un contenido
    const objeto = document.querySelector(eventList),
        contenedor = document.querySelector(div);
    objeto.addEventListener('click',() =>{
        contenedor.classList.toggle('hide');
    })
}
function ocultarMostrarOtraSec(eventList, divOcultar, divMostrar){
    //ocultar una seccion y mostrar otra distinta
    const objeto = document.querySelector(eventList),
        contenedor1 = document.querySelector(divOcultar),
        contenedor2 = document.querySelector(divMostrar);

    objeto.addEventListener('click',() =>{
        contenedor1.classList.add('hide');
        contenedor2.classList.remove('hide')
    })
}


//agrega eventlistener para submit de agregar alumno
submitBtnForm('form_agregarAlumno', nuevoAlumnoForm)

function submitBtnForm(idForm, funcionAEnviarDatos){
    document.getElementById(idForm).addEventListener('submit', function(event) {
        event.preventDefault();
    
        const formData = new FormData(this);
        funcionAEnviarDatos(formData)
        this.reset();
    });
}
function nuevoAlumnoForm(formData){
    const nombreAlumno = formData.get('nombre_alumno'), 
        primerApellido = formData.get('primeraApellido_alumno'), 
        segundoApellido = formData.get('segundoApellido_alumno'), 
        fechaNacimiento = formData.get('fechaNacimiento_alumno');

    crearAlumno(nombreAlumno, primerApellido, segundoApellido, fechaNacimiento)
}


function validarDato(dato) {
    let columnaNombre = dato.getAttribute('col_name');
    let valor = dato.innerText

    let valido = true;
    // Validación dependiendo del tipo de dato
    if (columnaNombre === 'nombre' || columnaNombre === 'apellido1' || columnaNombre === 'apellido2') {
        // Validar que no contenga números o símbolos o espacios. Acepta letras mayusculas, minusculas, acentos(à á).
        if (!/^[a-zA-Z\u00C0-\u017F]+$/.test(valor)) {
            valido = false;
        }
    } else if (columnaNombre === 'fechaNacimiento') {
        // Validar el formato de fecha, el formato correcto es 'YYYY-MM-DD' y que no contenga espacios.
        if (!/^\d{4}-\d{2}-\d{2}$/.test(valor) || /\s/.test(valor)) {
            valido = false;
        }
    }

    // Retroalimentación visual si algo está mal
    if (!valido) {
        dato.classList.add('invalid');
    } else {
        dato.classList.remove('invalid');
    }
    //Si valido es true es porque el valor es válido.
    return valido
}

//Funcionamiento edit btn y casillas editables en tabla
document.querySelector('#tabla_alumnos tbody').addEventListener('click', function(event) {

    if (event.target.closest('.btn_edit')) {
        event.preventDefault();
        let filaActual = event.target.closest('tr');
        let filaId = filaActual.getAttribute('row_id');

        filaActual.querySelector('.btn_save').style.display = 'block';
        filaActual.querySelector('.btn_cancel').style.display = 'block';

        // Ocultar el botón de edición
        filaActual.querySelector('.btn_edit').style.display = 'none';

        // Hacer toda la fila editable
        let datos_filaActual = filaActual.querySelectorAll('.row_data');
        datos_filaActual.forEach(function(dato_filaActual) {

            dato_filaActual.contentEditable = 'true';
            dato_filaActual.setAttribute('edit_type', 'button');
            dato_filaActual.classList.add('bg-warning');
            dato_filaActual.style.padding = '3px';

            // Añadir el valor original en caso de cancelar
            dato_filaActual.setAttribute('original_entry', dato_filaActual.innerHTML);

            validarDato(dato_filaActual)
            
        });
    }
    
    if (event.target.classList.contains('btn_cancel')) {
        event.preventDefault();
        let filaActual = event.target.closest('tr');
        let filaId = filaActual.getAttribute('row_id');

        // Ocultar botones de guardar y cancelar
        filaActual.querySelector('.btn_save').style.display = 'none';
        filaActual.querySelector('.btn_cancel').style.display = 'none';

        // Mostrar botón de editar
        filaActual.querySelector('.btn_edit').style.display = 'block';

        // Hacer las celdas no editables
        let datos_filaActual = filaActual.querySelectorAll('.row_data');
        datos_filaActual.forEach(function(dato_filaActual) {
            // dato_filaActual.setAttribute('edit_type', 'click');
            dato_filaActual.classList.remove('bg-warning');
            dato_filaActual.style.padding = '';
            dato_filaActual.contentEditable = 'false';
            // Restaurar valores originales
            dato_filaActual.innerHTML = dato_filaActual.getAttribute('original_entry');
            dato_filaActual.classList.remove('invalid');

        });
    }

    // Guardar edición
    if (event.target.classList.contains('btn_save')) {
        event.preventDefault();
        let filaActual = event.target.closest('tr');
        let filaId = filaActual.getAttribute('row_id');

        let datosFila = {};
        let datos_filaActual = filaActual.querySelectorAll('.row_data');
        let tieneDatosInvalidos = false;

        datos_filaActual.forEach(function(dato_filaActual) {
            // dato_filaActual.setAttribute('edit_type', 'click');
            validarDato(dato_filaActual)
            if(dato_filaActual.classList.contains('invalid')){
                tieneDatosInvalidos = true;
                alert('Verifica los datos nuevamente');
            }else{
                let columnaNombre = dato_filaActual.getAttribute('col_name');
                datosFila[columnaNombre] = dato_filaActual.innerHTML;
            }
        });
        console.log(datosFila)
        if (!tieneDatosInvalidos) {
            
            async function editarValoresAlumno(){
                try {
                    await editarAlumno(filaId, datosFila);
                } catch (error) {
                    console.error('Error al modificar alumno:', error);
                }
            }
            editarValoresAlumno();

            filaActual.querySelector('.btn_save').style.display = 'none';
            filaActual.querySelector('.btn_cancel').style.display = 'none';
            filaActual.querySelector('.btn_edit').style.display = 'block';
            
            datos_filaActual.forEach(function(dato_filaActual) {
                dato_filaActual.classList.remove('bg-warning');
                dato_filaActual.style.padding = '';
                dato_filaActual.contentEditable = 'false';
                dato_filaActual.setAttribute('original_entry', dato_filaActual.innerHTML);
            });
        }
    }

    if (event.target.closest('.btn_delete')) {
        event.preventDefault();
        let filaActual = event.target.closest('tr');
        let filaId = filaActual.getAttribute('row_id');

        confirmarEliminarAlumno(filaId);

    }

});

const inputSearch = document.querySelector('.busqueda input');
inputSearch.addEventListener('input', manejarInputSearch);
function manejarInputSearch() {
    const textoBusqueda = inputSearch.value.trim(); // Obtener el valor del input y limpiar espacios en blanco
    if (textoBusqueda.length > 0) {
        obtenerYMostrarAlumnos(textoBusqueda); // Llamar a la función con el valor de búsqueda
    }else{
        obtenerYMostrarAlumnos();
    }
};

const botonGenerarAlumnoAleatorio = document.getElementById('generarAlumnoAleatorio');
botonGenerarAlumnoAleatorio.addEventListener('click', generarAlumnoAleatorio);
async function generarAlumnoAleatorio(event){
    event.preventDefault();
    function generarNombreAleatorio() {
        const nombres = ['Juan', 'María', 'Pedro', 'Laura', 'Carlos', 'Ana', 'Diego', 'Sofía', 'Pablo', 'Elena'];
        return nombres[Math.floor(Math.random() * nombres.length)];
    }
    function generarApellidoAleatorio() {
        const apellidos = ['García', 'Martínez', 'González', 'Rodríguez', 'Fernández', 'López', 'Díaz', 'Pérez', 'Sánchez', 'Romero'];
        return apellidos[Math.floor(Math.random() * apellidos.length)];
    }
    function generarFechaNacimientoAleatoria() {
        const año = Math.floor(Math.random() * (2005 - 1980 + 1)) + 1980;
        const mes = Math.floor(Math.random() * 12) + 1;
        const dia = Math.floor(Math.random() * 28) + 1; // Día aleatorio (considerando máximo de 28 días para simplificar)
        return `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    }
    await crearAlumno(generarNombreAleatorio(), generarApellidoAleatorio(), generarApellidoAleatorio(), generarFechaNacimientoAleatoria());
};






const urlGrupos = `${urlSrc}/grupos`;
//grupos status
let grupos = [];
async function obtenerYMostrarGrupos() {
    console.log(`URL: ${urlGrupos}`);
    try {
        const response = await fetch(urlGrupos);
        if (!response.ok) {
            throw new Error('Error al obtener la lista de grupos');
        }
        const gruposObtenidos = await response.json();
        mostrarGruposGrid(gruposObtenidos);
        console.log('Grupos obtenidos correctamente: ', gruposObtenidos);
        grupos = gruposObtenidos;
    } catch (error) {
        console.error('Error al obtener y mostrar grupos:', error);
    }
}

async function crearGrupo(nombreGrupo) {
    console.log(nombreGrupo)
    try {
        const response = await fetch(urlGrupos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombreGrupo }),
        });
        if (!response.ok) {
            throw new Error('Error al crear grupo');
        }
        const nuevoGrupo = await response.json();
        await obtenerYMostrarGrupos();
        console.log('Nuevo grupo creado:', nuevoGrupo);
    } catch (error) {
        console.error('Error al crear grupo:', error);
    }
}
const crearGrupoBtnSup = document.getElementById('crearGrupoBtn_sup'),
    eliminarGrupoBtnSup = document.getElementById('eliminarGrupoBtn_sup'),
    selectorDropdown = document.querySelector('.selectorCrear');

function mostrarGruposGrid(grupos) {
    const gruposContenedor = document.querySelector('.grupos_grid');
    const noExisteLabel = document.querySelector('.crearGrupo_noExiste_label');     
    
        gruposContenedor.innerHTML = '';

    if(grupos.length === 0){
        noExisteLabel.classList.remove('hidden');
        eliminarGrupoBtnSup.disabled = true;
    }else{
        noExisteLabel.classList.add('hidden');
        if(selectorDropdown.classList.contains('hide')){
            eliminarGrupoBtnSup.disabled = false;
        }
        

        grupos.forEach(grupo => {
            gruposContenedor.insertAdjacentHTML('beforeend', `
                <div class="grupo_contenedor">
                    <div class="grupo_letra">
                        <span>${grupo.nombre}</span>
                    </div>
                    <div class="grupo_cantidadAlumnos">
                        <p>No. de alumnos: <span>${grupo.length}</span></p>
                    </div>
                    <div class="grupoEliminar hide">
                        <div class="checkboxEliminar">
                            <input type="checkbox" name="seleccionEliminar" id="eliminar${grupo.nombre}" value="${grupo.nombre}">
                            <label for="eliminar${grupo.nombre}">Seleccionar</label>
                        </div>
                    </div>
                </div>
            `);
        });
    }
    
}
async function eliminarGrupos(grupos) {
    try {
        const response = await fetch(`${urlGrupos}/delete-multiple`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(grupos)
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar grupos: ${grupos}`);
        }
        await obtenerYMostrarGrupos(); // Actualizar la tabla después de eliminar
        console.log(`Grupos eliminados correctamente: ${grupos}`, );
    } catch (error) {
        console.error(`Error al eliminar grupos:`, error);
    }
}
async function confirmarEliminarGrupos(arrayGrupos) {
    if (confirm(`¿Estás seguro de eliminar los grupos ${arrayGrupos.join(', ')}?`)) {
        await eliminarGrupos(arrayGrupos);
    }
}

const agregarGrupoBtn = document.getElementById('agregarGrupoBtn_first');

agregarGrupoBtn.addEventListener('click', nombrarGrupo)
function nombrarGrupo(){
    //Funcionalidad al click en Crear grupo. Despliegue de dropdown de selector para nombrar grupo y agregarlo.
    const selectorGrupo = document.getElementById('letras');

    selectorDropdown.classList.toggle('hide');
    botonEstado(crearGrupoBtnSup);
    
    if(selectorGrupo.value !== ""){
        crearGrupo(selectorGrupo.value);
    }else{
        alert('Nombre de grupo inválido')
    }
}
//función para habiltar y deshabilitar un objeto
function toggleDisabled(objetoToggle){
    //Ej de objetoToggle: un botón, input, etc.
    objetoToggle.disabled = !objetoToggle.disabled;
}

function deshabilitarOptionSelector(){
    const selectorGrupo = document.getElementById('letras');
    const nombresGrupos = grupos.map(grupo => grupo.nombre);

    const opciones = selectorGrupo.querySelectorAll('option');
    opciones.forEach(opcion => {
        opcion.disabled = false;
    });

    nombresGrupos.forEach(nombre =>{
        const opcionSelector = selectorGrupo.querySelector(`option[value=${nombre}]`);
        opcionSelector.disabled = true;
    });
    selectorGrupo.selectedIndex = 0;
}

crearGrupoBtnSup.addEventListener('click', crearGrupoDropdown);
function crearGrupoDropdown(){
    const gruposContenedor = document.querySelector('.grupos_grid');
    selectorDropdown.classList.toggle('hide');

    deshabilitarOptionSelector();

    botonEstado(crearGrupoBtnSup);
    
    if(gruposContenedor.childElementCount > 0 && !selectorDropdown.classList.contains('hide')){
        eliminarGrupoBtnSup.disabled = true;
    }else if(gruposContenedor.childElementCount > 0 && selectorDropdown.classList.contains('hide')){
        eliminarGrupoBtnSup.disabled = false;
    }
    
}

const gruposSec = document.querySelector('.grupos'),
    gruposGrid = gruposSec.querySelector('.grupos_grid'),
    grupoInfoSec = gruposSec.querySelector('.grupo_informacion'),
    btnRegresar = document.getElementById('cancelarRegresarBtn'),
    btnsSup = document.querySelector('.botones_sup');

//Interacción de tarjetas de Grupos
gruposGrid.addEventListener('click', async function(event) {
    const grupoContenedorActual = event.target.closest('.grupo_contenedor'),
        grupoEliminarContenedor = event.target.closest('.grupoEliminar'),
        grupoContenedores = gruposGrid.querySelectorAll('.grupo_contenedor');
    // event.preventDefault();
    
    if(!grupoEliminarContenedor && grupoContenedorActual !== null){

        gruposSec.style.margin = 0;

        btnsSup.classList.add('hide');
        btnRegresar.classList.remove('hidden');

        grupoContenedores.forEach(contenedor => {
            if(contenedor !== grupoContenedorActual){
                contenedor.classList.remove('active');
                contenedor.classList.add('hide');
            }
            if(contenedor === grupoContenedorActual){
                contenedor.classList.add('active');
                gruposSec.style.flexDirection = 'row';
                gruposGrid.style.width = 'auto';
                grupoInfoSec.classList.remove('hide');
            }
            
        })
    }else if(grupoEliminarContenedor){
        const eliminarSpan = document.querySelector('.eliminarSeleccionados_span span');
        const checkboxEliminar = grupoEliminarContenedor.querySelector('input');
        if(checkboxEliminar.checked){
            checkboxEliminar.checked = false;
            eliminarSpan.innerText = verificarCheckboxChecked('seleccionEliminar');
        }else{
            checkboxEliminar.checked = true;
            eliminarSpan.innerText = verificarCheckboxChecked('seleccionEliminar');
        }
    }
});
btnRegresar.addEventListener('click', regresarAGruposGrid);
function regresarAGruposGrid(){
    gruposSec.style.flexDirection = 'column';
    gruposGrid.style.width = '100%';
    grupoInfoSec.classList.add('hide');
    btnRegresar.classList.add('hidden');
    btnsSup.classList.remove('hide');
    obtenerYMostrarGrupos();
}

function verificarCheckboxChecked(name){
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
    let contadorCheckeados = 0;

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            contadorCheckeados++;
        }
    });
    return contadorCheckeados;
}

//Funcionalidad de Boton Eliminar grupo y seleccion de grupos a eliminar
const trashBtn = document.querySelector('.eliminarSeleccionados');
eliminarGrupoBtnSup.addEventListener('click', seleccionEliminar);
function seleccionEliminar(){
    const grupoContenedores = gruposGrid.querySelectorAll('.grupo_contenedor');
    const eliminarSpan = document.querySelector('.eliminarSeleccionados_span span');
    toggleDisabled(crearGrupoBtnSup);
    grupoContenedores.forEach(contenedor => {
        const seleccionEliminarLayer = contenedor.querySelector('.grupoEliminar');
        if(seleccionEliminarLayer.classList.contains('hide')){
            seleccionEliminarLayer.classList.remove('hide');
            trashBtn.classList.remove('hide');
        }else{
            seleccionEliminarLayer.classList.add('hide');
            seleccionEliminarLayer.querySelector('input').checked = false
            eliminarSpan.innerText = verificarCheckboxChecked('seleccionEliminar');
            trashBtn.classList.add('hide');
        }
    })
    botonEstado(eliminarGrupoBtnSup);
}

function botonEstado(idBtn){
    const divEstado1 = idBtn.querySelector('.btn_estado.estado1'),
        divEstado2 = idBtn.querySelector('.btn_estado.estado2');

    if(divEstado2.classList.contains('hide')){
        divEstado2.classList.remove('hide');
        divEstado1.classList.add('hide');

    }else{
        divEstado2.classList.add('hide');
        divEstado1.classList.remove('hide');
    }
}

trashBtn.addEventListener('click', trashBtnEvent);
async function trashBtnEvent(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="seleccionEliminar"]');
    const eliminarSpan = document.querySelector('.eliminarSeleccionados_span span');
    
    if(verificarCheckboxChecked('seleccionEliminar') !== 0){
        toggleDisabled(crearGrupoBtnSup);
        const valoresCheckeados = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

        await confirmarEliminarGrupos(valoresCheckeados);
        botonEstado(eliminarGrupoBtnSup);
        eliminarSpan.innerText = verificarCheckboxChecked('seleccionEliminar');
        trashBtn.classList.add('hide');
        deshabilitarOptionSelector();
    }else{
        alert('No has seleccionado ningún grupo');
    }
    
}

document.addEventListener('click', clickEnDocumento);
function clickEnDocumento(event){

    //Funcionalidad para cerrar el dropdown del boton 'Crear grupo' al hacer click en cualquier parte, a excepción del mismo dropdown.
    if(!selectorDropdown.contains(event.target) && !selectorDropdown.classList.contains('hide') && !crearGrupoBtnSup.contains(event.target)){
        crearGrupoDropdown();
    }
}

// {
//     "nombre": "A",
//     "alumnos": [],
//     "length": 0
//   },
//   {
//     "nombre": "B",
//     "alumnos": [],
//     "length": 0
//   },
//   {
//     "nombre": "C",
//     "alumnos": [],
//     "length": 0
//   },
//   {
//     "nombre": "D",
//     "alumnos": [],
//     "length": 0
//   },
//   {
//     "nombre": "E",
//     "alumnos": [],
//     "length": 0
//   },
//   {
//     "nombre": "F",
//     "alumnos": [],
//     "length": 0
//   }

