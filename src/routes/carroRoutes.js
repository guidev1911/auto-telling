const express = require('express');
const { getAllCarros, getCarroById, createCarro, updateCarro, deleteCarro } = require('../controllers/carrosController');
const { authenticateToken, authorizeRole } = require('../middlewares/authenticate');

const router = express.Router();

/**
 * @swagger
 * /carros:
 *   get:
 *     summary: Busca todos os carros registrados
 *     tags:
 *       - Carros
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Carros encontrados e retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do carro
 *                 marca:
 *                   type: string
 *                   description: Marca do carro
 *                 modelo:
 *                   type: string
 *                   description: Modelo do carro
 *                 categoria:
 *                   type: string
 *                   description: Categoria do carro 
 *                 ano:
 *                   type: integer
 *                   description: Ano do carro
 *                 cor:
 *                   type: string
 *                   description: Cor do carro
 *                 quilometragem:
 *                   type: integer
 *                   description: Quilometragem do carro
 *                 potencia:
 *                   type: integer
 *                   description: Potência do motor em CV
 *                 motor:
 *                   type: string
 *                   description: Tipo de motor do carro
 *                 zero_a_cem:
 *                   type: number
 *                   format: float
 *                   description: Tempo de aceleração de 0 a 100 km/h
 *                 velocidade_final:
 *                   type: integer
 *                   description: Velocidade final do carro
 *                 preco:
 *                   type: number
 *                   format: float
 *                   description: Preço do carro
 *                 numero_portas:
 *                   type: integer
 *                   description: Número de portas do carro
 *                 tipo_tracao:
 *                   type: string
 *                   description: Tipo de tração do carro
 *                 consumo_medio:
 *                   type: string
 *                   description: Consumo médio do carro em km/l
 *                 status:
 *                   type: string
 *                   enum: ['Disponível', 'Indisponível']
 *                   description: Status do carro
 *                 caracteristicas:
 *                   type: string
 *                   description: Características adicionais do carro
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 */
router.get('/', authenticateToken, authorizeRole(['vendedor', 'gerente','admin']), getAllCarros);

/**
 * @swagger
 * /carros/{id}:
 *   get:
 *     summary: Busca um carro pelo ID
 *     tags:
 *       - Carros
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do carro a ser buscado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carro encontrado e retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do carro
 *                 marca:
 *                   type: string
 *                   description: Marca do carro
 *                 modelo:
 *                   type: string
 *                   description: Modelo do carro
 *                 categoria:
 *                   type: string
 *                   description: Categoria do carro 
 *                 ano:
 *                   type: integer
 *                   description: Ano do carro
 *                 cor:
 *                   type: string
 *                   description: Cor do carro
 *                 quilometragem:
 *                   type: integer
 *                   description: Quilometragem do carro
 *                 potencia:
 *                   type: integer
 *                   description: Potência do motor em CV
 *                 motor:
 *                   type: string
 *                   description: Tipo de motor do carro
 *                 zero_a_cem:
 *                   type: number
 *                   format: float
 *                   description: Tempo de aceleração de 0 a 100 km/h
 *                 velocidade_final:
 *                   type: integer
 *                   description: Velocidade final do carro
 *                 preco:
 *                   type: number
 *                   format: float
 *                   description: Preço do carro
 *                 numero_portas:
 *                   type: integer
 *                   description: Número de portas do carro
 *                 tipo_tracao:
 *                   type: string
 *                   description: Tipo de tração do carro
 *                 consumo_medio:
 *                   type: string
 *                   description: Consumo médio do carro em km/l
 *                 status:
 *                   type: string
 *                   enum: ['Disponível', 'Indisponível']
 *                   description: Status do carro
 *                 caracteristicas:
 *                   type: string
 *                   description: Características adicionais do carro
 *       404:
 *         description: Carro não encontrado no banco de dados
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 */
router.get('/:id', authenticateToken, authorizeRole(['vendedor', 'gerente','admin']), getCarroById);

/**
 * @swagger
 * /carros:
 *   post:
 *     summary: Cria um novo carro
 *     tags:
 *       - Carros
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *                 description: A marca do carro 
 *               modelo:
 *                 type: string
 *                 description: O modelo do carro 
 *               categoria:
 *                 type: string
 *                 description: A categoria do carro 
 *               ano:
 *                 type: integer
 *                 description: O ano de fabricação do carro
 *               cor:
 *                 type: string
 *                 description: A cor do carro 
 *               quilometragem:
 *                 type: integer
 *                 description: A quilometragem do carro, indicando o uso do carro
 *               potencia:
 *                 type: integer
 *                 description: A potência do motor em cavalos
 *               motor:
 *                 type: string
 *                 description: O tipo de motor, se possui sistema híbrido e quantidade de cilindros
 *               zero_a_cem:
 *                 type: number
 *                 description: O tempo que o carro leva para ir de 0 a 100 km/h
 *               velocidade_final:
 *                 type: integer
 *                 description: A velocidade máxima do carro
 *               preco:
 *                 type: number
 *                 format: float
 *                 description: O preço do carro
 *               numero_portas:
 *                 type: integer
 *                 description: O número de portas do carro
 *               tipo_tracao:
 *                 type: string
 *                 description: O tipo de tração do carro
 *               consumo_medio:
 *                 type: string
 *                 description: O consumo médio do carro em km/l
 *               status:
 *                 type: string
 *                 enum: ['Disponível', 'Indisponível']
 *                 description: O status do carro 
 *               caracteristicas:
 *                 type: string
 *                 description: Características adicionais do carro, opcionais ou edições limitadas
 *     responses:
 *       201:
 *         description: Carro criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 */
router.post('/', authenticateToken, authorizeRole(['gerente', 'admin']), createCarro);

/**
 * @swagger
 * /carros/{id}:
 *   put:
 *     summary: Atualiza as informações de um carro existente
 *     tags:
 *       - Carros
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do carro a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *                 description: A marca do carro 
 *               modelo:
 *                 type: string
 *                 description: O modelo do carro 
 *               categoria:
 *                 type: string
 *                 description: A categoria do carro 
 *               ano:
 *                 type: integer
 *                 description: O ano de fabricação do carro
 *               cor:
 *                 type: string
 *                 description: A cor do carro 
 *               quilometragem:
 *                 type: integer
 *                 description: A quilometragem do carro, indicando o uso do carro
 *               potencia:
 *                 type: integer
 *                 description: A potência do motor em cavalos
 *               motor:
 *                 type: string
 *                 description: O tipo de motor, se possui sistema híbrido e quantidade de cilindros
 *               zero_a_cem:
 *                 type: number
 *                 description: O tempo que o carro leva para ir de 0 a 100 km/h
 *               velocidade_final:
 *                 type: integer
 *                 description: A velocidade máxima do carro
 *               preco:
 *                 type: number
 *                 format: float
 *                 description: O preço do carro
 *               numero_portas:
 *                 type: integer
 *                 description: O número de portas do carro
 *               tipo_tracao:
 *                 type: string
 *                 description: O tipo de tração do carro
 *               consumo_medio:
 *                 type: string
 *                 description: O consumo médio do carro em km/l
 *               status:
 *                 type: string
 *                 enum: ['Disponível', 'Indisponível']
 *                 description: O status do carro 
 *               caracteristicas:
 *                 type: string
 *                 description: Características adicionais do carro, opcionais ou edições limitadas
 *     responses:
 *       200:
 *         description: Carro atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou ID mal formatado
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 *       404:
 *         description: Carro não encontrado
 */
router.put('/:id', authenticateToken, authorizeRole(['gerente','admin']), updateCarro);

/**
 * @swagger
 * /carros/{id}:
 *   delete:
 *     summary: Exclui um carro pelo ID
 *     tags:
 *       - Carros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do carro a ser excluído
 *     responses:
 *       204:
 *         description: Carro excluído com sucesso. Nenhum conteúdo retornado.
 *       400:
 *         description: ID mal formatado
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 *       404:
 *         description: Carro não encontrado
 */
router.delete('/:id', authenticateToken, authorizeRole(['gerente','admin']), deleteCarro);

module.exports = router;


