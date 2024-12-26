const express = require('express');
const carrosRoutes = require('./src/routes/carroRoutes');

const app = express();

app.use(express.json());

app.use('/carros', carrosRoutes);

module.exports = app; 
