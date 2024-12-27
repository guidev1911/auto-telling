const express = require('express');
const { getAllCarros, getCarroById, createCarro, updateCarro, deleteCarro } = require('../controllers/carrosController');
const { authenticateToken, authorizeRole } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', authenticateToken, authorizeRole(['vendedor', 'gerente']), getAllCarros);
router.get('/:id', authenticateToken, authorizeRole(['vendedor', 'gerente']), getCarroById);
router.post('/', authenticateToken, authorizeRole(['gerente']), createCarro);
router.put('/:id', authenticateToken, authorizeRole(['gerente']), updateCarro);
router.delete('/:id', authenticateToken, authorizeRole(['gerente']), deleteCarro);

module.exports = router;


