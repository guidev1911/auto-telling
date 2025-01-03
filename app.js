const express = require('express');
const carrosRoutes = require('./src/routes/carroRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { swaggerUi, specs } = require('./docs/swagger');

const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/carros', carrosRoutes);
app.use('/auth', authRoutes);

module.exports = app; 
