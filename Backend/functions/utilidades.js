function calcularEdad(fechaNacimientoValue) {
    // Lógica para calcular la edad
    const fechaActual = new Date();
    const fechaNacimiento = new Date(fechaNacimientoValue);
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = fechaActual.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && fechaActual.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}
function generarMatricula(matriculas){
    let matriculaString = (matriculas + 1).toString().padStart(4, '0');
    return matriculaString

}

module.exports = {
    calcularEdad,
    generarMatricula,
};