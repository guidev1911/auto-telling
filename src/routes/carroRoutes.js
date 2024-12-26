const express = require('express');
const { getAllCarros, getCarroById, createCarro, updateCarro, deleteCarro } = require('../controllers/carrosController');
const { authenticateToken, authorizeRole } = require('../middlewares/authenticate');
const pool = require('../config/database');
const { registrarUsuario } = require('../controllers/registerController');
const { login } = require('../controllers/loginController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/', authenticateToken, authorizeRole(['vendedor', 'gerente']), getAllCarros);
router.get('/:id', authenticateToken, authorizeRole(['vendedor', 'gerente']), getCarroById);
router.post('/', authenticateToken, authorizeRole(['gerente']), createCarro);
router.put('/:id', authenticateToken, authorizeRole(['gerente']), updateCarro);
router.delete('/:id', authenticateToken, authorizeRole(['gerente']), deleteCarro);
router.post('/register', registrarUsuario); 
router.post('/login', login);

module.exports = router;

