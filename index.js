const express = require('express');
const consul = require('consul');

const app = express();
const port = 3000;

// Configuración de Consul
const consulClient = consul();

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Registro en Consul
consulClient.agent.service.register({
  name: 'mi-servicio',
  address: 'localhost', // Debería ser la dirección de tu servicio
  port: port,
  check: {
    http: `http://localhost:${port}/health`,
    interval: '10s',
  },
});

// Manejo de señales para la desregistración al cerrar la aplicación
process.on('SIGINT', () => {
  consulClient.agent.service.deregister('mi-servicio', () => {
    process.exit();
  });
});

// Iniciar la aplicación
app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});
