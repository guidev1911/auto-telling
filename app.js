const express = require('express');
const carrosRoutes = require('./src/routes/carroRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/carros', carrosRoutes);
app.use('/auth', authRoutes);

module.exports = app; 
