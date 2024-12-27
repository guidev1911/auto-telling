const express = require('express');
const { registrarUsuario } = require('../controllers/registerController');
const { login } = require('../controllers/loginController');

const router = express.Router();

router.post('/register', registrarUsuario); 
router.post('/login', login);

module.exports = router;
