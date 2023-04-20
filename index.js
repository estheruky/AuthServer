const express = require('express');
const cors =require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config(); // hace que coja el archivo .env



//console.log(process.env);


// crear el servidor/aplicacion de express

const app = express();


// conexion con mongo bbdd

dbConnection();

// Directorio Publico

app.use(express.static('public'));


// cors
app.use( cors()); // para aceptar peticiones de un dominio


// Lectura y parseo del body

app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
//app.use('/api/sistemaReserva', require('./routes/sistemaReserva'));




// levantar aplicacion 


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});