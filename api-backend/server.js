const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json()); // Habilita la lectura de JSON en el cuerpo (body) de las peticiones

// CORS: el frontend corre en localhost:8082 y la API en localhost:5000 (origenes distintos),
// sin estas cabeceras el navegador bloquea las peticiones fetch().
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Log de cada peticion para verlas en la consola de Docker Compose
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

// Simulación de Base de Datos en memoria
let tareas = [
  { id: 1, texto: "Aprender conceptos básicos de Docker" },
  { id: 2, texto: "Desplegar mi primer arquitectura de Microservicios" }
];

// [GET] Obtener la lista completa de tareas
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

// [POST] Crear una nueva tarea
app.post('/api/tareas', (req, res) => {
  const nuevaTarea = { id: Date.now(), texto: req.body.texto };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// ===== RETO CALIFICABLE =====
// [DELETE] Vaciar toda la lista de tareas
// IMPORTANTE: debe ir ANTES de '/api/tareas/:id', si no Express interpreta "limpiar" como un id.
app.delete('/api/tareas/limpiar', (req, res) => {
  const cantidad = tareas.length;
  tareas = [];
  res.json({ mensaje: `Lista vaciada correctamente (${cantidad} tareas eliminadas)` });
});

// [DELETE] Eliminar una tarea específica mediante su ID en la URL
app.delete('/api/tareas/:id', (req, res) => {
  const idEliminar = parseInt(req.params.id);
  tareas = tareas.filter(t => t.id !== idEliminar);
  res.json({ mensaje: "Tarea eliminada correctamente" });
});

app.listen(PORT, () => console.log(`API REST corriendo en el puerto ${PORT}`));
