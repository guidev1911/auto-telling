const express = require('express');
const { getAllCarros, getCarroById, createCarro, updateCarro, deleteCarro } = require('../controllers/carrosController');
const { authenticateToken, authorizeRole } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', authenticateToken, authorizeRole(['vendedor', 'gerente','admin']), getAllCarros);
router.get('/:id', authenticateToken, authorizeRole(['vendedor', 'gerente','admin']), getCarroById);
router.post('/', authenticateToken, authorizeRole(['gerente', 'admin']), createCarro);
router.put('/:id', authenticateToken, authorizeRole(['gerente','admin']), updateCarro);
router.delete('/:id', authenticateToken, authorizeRole(['gerente','admin']), deleteCarro);

module.exports = router;


