const express = require('express');
const carrosRoutes = require('./src/routes/carroRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { swaggerUi, specs } = require('./docs/swagger');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
  }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/carros', carrosRoutes);
app.use('/auth', authRoutes);

module.exports = app; 
