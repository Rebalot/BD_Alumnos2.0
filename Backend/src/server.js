const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const colors = require('colors');
const PORT = 3000;
const Alumno = require('../functions/classAlumno');
const { calcularEdad, generarMatricula } = require('../functions/utilidades');
const Grupo = require('../functions/classGrupo');

const cors = require('cors');
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
};

//Middleware por si el servidor sirviera el frontend
// const publicDirectoryPath = path.join(__dirname, '../../Frontend')
// app.use(express.static(publicDirectoryPath));

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());


//Base de datos local
const bdAlumnosPath = path.join(__dirname, 'bdAlumnos.json');
let bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));

// Ruta para obtener todos los alumnos
app.get('/alumnos', (req, res) => {
    const name = req.query.name;
    try {
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));
        // console.log(name);
        if (!name) {
            // console.log(bdAlumnos.alumnos);
            res.json(bdAlumnos.alumnos);
        }else{
            const nombreBuscado = bdAlumnos.alumnos.filter((alumno) => {
                const nombreCompleto = `${alumno.nombre} ${alumno.apellido1} ${alumno.apellido2}`
                return nombreCompleto.toLocaleLowerCase().includes(name.toLocaleLowerCase())
            });
        
            res.json(nombreBuscado);
        }

    } catch (err) {
        console.error('Error al leer archivo de datos:', err);
        res.status(500).json({ error: 'Error al obtener datos de alumnos' });
    }
    
});
// Ruta para obtener alumno con matricula X
app.get('/alumnos/:matricula', (req, res) => {
    const matricula = req.params.matricula;
    try{
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));
        const alumnoEncontrado = bdAlumnos.alumnos.find(alumno => alumno.matricula === matricula);
        if (alumnoEncontrado) {
            console.log(`Alumno con matrícula ${alumnoEncontrado.matricula} buscado correctamente`);
            res.json(alumnoEncontrado);
        } else {
            res.status(404).json({ error: 'Alumno no encontrado' });
        }
    } catch (err) {
        console.error('Error al leer archivo de datos:', err);
        res.status(500).json({ error: 'Error al obtener datos de alumnos' });
    }
});
// Ruta para agregar un alumno
app.post('/alumnos', (req, res) => {
    console.log(req.body)
    const { nombre, apellido1, apellido2, fechaNacimiento } = req.body;

    const matricula = generarMatricula(obtenerMatriculaMasAlta());
    const edad = calcularEdad(fechaNacimiento);
    // Crear un nuevo objeto Alumno
    const nuevoAlumno = new Alumno(matricula, nombre, apellido1, apellido2, fechaNacimiento, edad);
    try{
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));
        bdAlumnos.alumnos.push(nuevoAlumno);
        fs.writeFile(bdAlumnosPath, JSON.stringify(bdAlumnos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar datos:', err);
                return res.status(500).json({ error: 'Error al guardar datos' });
            }
            console.log(`Alumno con matrícula ${nuevoAlumno.matricula} creado correctamente`);
            res.status(201).json(nuevoAlumno);
        });
    } catch (err) {
        console.error('Error al leer archivo de datos:', err);
        res.status(500).json({ error: 'Error al obtener datos de alumnos' });
    }
});
// Ruta para modificar una propiedad a un alumno
app.patch('/alumnos/:matricula', (req, res) => {
    const matricula = req.params.matricula;
    let datosAlumno = req.body;
    // console.log('matricula: ', matricula);
    
    const edad = calcularEdad(datosAlumno.fechaNacimiento);
    datosAlumno.edad = edad;
    // console.log('datosAlumno: ', datosAlumno);
    try {
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));

        let alumnoEncontrado = bdAlumnos.alumnos.find(alumno => alumno.matricula === matricula);
        console.log('alumnoEncontrado: ', alumnoEncontrado);

        // Sobrescribir las propiedades del alumno encontrado con los nuevos datos
        for (let key in datosAlumno) {
            alumnoEncontrado[key] = datosAlumno[key];
        }

        fs.writeFile(bdAlumnosPath, JSON.stringify(bdAlumnos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar datos:', err);
                return res.status(500).json({ error: 'Error al guardar datos' });
            }
            console.log(`Alumno con matrícula ${alumnoEncontrado.matricula} modificado correctamente`);
            res.status(200).json(alumnoEncontrado);
        });
        
    } catch (err) {
        console.error('Error al leer archivo de datos:', err);
        res.status(500).json({ error: 'Error al obtener datos de alumnos' });
    }
});

// Ruta para eliminar un alumno por matrícula
app.delete('/alumnos/:matricula', (req, res) => {
    const matricula = req.params.matricula;
    try {
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));
        bdAlumnos.alumnos = bdAlumnos.alumnos.filter(alumno => alumno.matricula !== matricula);
        fs.writeFile(bdAlumnosPath, JSON.stringify(bdAlumnos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar datos:', err);
                return res.status(500).json({ error: 'Error al guardar datos' });
            }
            console.log(`Alumno con matrícula ${matricula} eliminado correctamente`);
            res.json({ message: `Alumno con matrícula ${matricula} eliminado correctamente` });
        });
    } catch (err) {
    console.error('Error al leer archivo de datos:', err);
    res.status(500).json({ error: 'Error al obtener datos de alumnos' });
    }
});
function obtenerMatriculaMasAlta() {
    try {
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));
        const alumnos = bdAlumnos.alumnos;
        
        if (alumnos.length === 0) {
        return 0;
        }

        // Encontrar la matrícula más alta
        const maxMatricula = alumnos.reduce((max, alumno) => {
        const matriculaNum = parseInt(alumno.matricula);
        return matriculaNum > max ? matriculaNum : max;
        }, 0);

        return maxMatricula;
    } catch (error) {
        console.error('Error al obtener datos de alumnos', error);
        return bdAlumnos.alumnos.length;
    }
    }
/////////////////////////////////////////
app.get('/grupos', (req, res) => {
    try {
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));

        res.json(bdAlumnos.grupos);
    } catch (err) {
        console.error('Error al leer archivo de datos:', err);
        res.status(500).json({ error: 'Error al obtener grupos' });
    }
});
app.post('/grupos', (req, res) => {
    const { nombreGrupo } = req.body;
    // Crear un nuevo objeto Grupo
    const nuevoGrupo = new Grupo(nombreGrupo);
    try{
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));
        bdAlumnos.grupos.push(nuevoGrupo)
        fs.writeFile(bdAlumnosPath, JSON.stringify(bdAlumnos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar datos:', err);
                return res.status(500).json({ error: 'Error al guardar datos' });
            }
            console.log(`Grupo ${nuevoGrupo.nombre} creado correctamente`);
            res.status(201).json(nuevoGrupo);
        });
    } catch (err) {
        console.error('Error al leer archivo de datos:', err);
        res.status(500).json({ error: 'Error al obtener datos de alumnos' });
    }
});
// Ruta para eliminar seleccion de grupos
app.delete('/grupos/delete-multiple', (req, res) => {
    const arrayGruposAEliminar= req.body;
    try {
        bdAlumnos = JSON.parse(fs.readFileSync(bdAlumnosPath, 'utf8'));
        bdAlumnos.grupos = bdAlumnos.grupos.filter(grupo => !arrayGruposAEliminar.includes(grupo.nombre));
        fs.writeFile(bdAlumnosPath, JSON.stringify(bdAlumnos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar datos:', err);
                return res.status(500).json({ error: 'Error al guardar datos' });
            }
            console.log(`Grupos eliminados correctamente`);
            res.json({ message: `Grupos eliminados correctamente` });
        });
    } catch (err) {
    console.error('Error al leer archivo de datos:', err);
    res.status(500).json({ error: 'Error al obtener datos de grupos' });
    }
});






app.listen(PORT, () => {
    console.log(`Servidor API iniciado en http://localhost:${PORT}`.yellow);
});