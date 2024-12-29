const express = require('express');
const { 
    registrarUsuario,
    deletarUsuario,
    atualizarUsuario,
    buscarTodosUsuarios,
    buscarUsuarioPorId
 } = require('../controllers/registerController');

const { authenticateToken, authorizeRole } = require('../middlewares/authenticate');
const { login } = require('../controllers/loginController');

const router = express.Router();

router.post('/register', authenticateToken, authorizeRole(['admin']), registrarUsuario); 
router.delete('/user/:id', authenticateToken, authorizeRole(['admin']), deletarUsuario);
router.put('/user/:id', authenticateToken, authorizeRole(['admin']), atualizarUsuario);
router.get('/user', authenticateToken, authorizeRole(['admin']), buscarTodosUsuarios);
router.get('/user/:id', authenticateToken, authorizeRole(['admin']), buscarUsuarioPorId);
router.post('/login', login);

module.exports = router;
