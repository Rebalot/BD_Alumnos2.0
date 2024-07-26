class Alumno {
    constructor(matricula, nombre, apellido1, apellido2, fechaNacimiento, edad) {
        this.matricula = matricula;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.fechaNacimiento = fechaNacimiento;
        this.edad = edad;
        this.grupo = '';
        this.materias = [];
        this.calificaciones = {}
    }
    
}
module.exports = Alumno;