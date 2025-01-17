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

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Busca todos os usuários registrados
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Usuários encontrados e retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: E-mail do usuário
 *                 senha:
 *                   type: string
 *                   description: Senha do usuário
 *                 nivel:
 *                   type: string
 *                   enum: ['vendedor','gerente','admin']
 *                   description: define o poder do usuário dentro do sistema
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 */
router.get('/user', authenticateToken, authorizeRole(['admin']), buscarTodosUsuarios);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário a ser buscado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado e retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: E-mail do usuário
 *                 senha:
 *                   type: string
 *                   description: Senha do usuário
 *                 nivel:
 *                   type: string
 *                   enum: ['vendedor','gerente','admin']
 *                   description: define o poder do usuário dentro do sistema
 *       404:
 *         description: Usuário não encontrado no banco de dados
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 */
router.get('/user/:id', authenticateToken, authorizeRole(['admin']), buscarUsuarioPorId);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: E-mail do usuário
 *                 senha:
 *                   type: string
 *                   description: Senha do usuário
 *                 nivel:
 *                   type: string
 *                   enum: ['vendedor','gerente','admin']
 *                   description: define o poder do usuário dentro do sistema
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 *       409:
 *         description: E-mail ja foi cadastrado no sistema
 */
router.post('/register', authenticateToken, authorizeRole(['admin']), registrarUsuario); 
// router.post('/register', registrarUsuario);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza as informações de um usuário existente
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: E-mail do usuário
 *                 senha:
 *                   type: string
 *                   description: Senha do usuário
 *                 nivel:
 *                   type: string
 *                   enum: ['vendedor','gerente','admin']
 *                   description: define o poder do usuário dentro do sistema
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: todos os campos são obrigatórios 
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 *       409:
 *         description: E-mail ja foi cadastrado no sistema
 */
router.put('/user/:id', authenticateToken, authorizeRole(['admin']), atualizarUsuario);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser excluído
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso. Nenhum conteúdo retornado.
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/user/:id', authenticateToken, authorizeRole(['admin']), deletarUsuario);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza as informações de um usuário existente
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: E-mail do usuário
 *                 senha:
 *                   type: string
 *                   description: Senha do usuário
 *                 nivel:
 *                   type: string
 *                   enum: ['vendedor','gerente','admin']
 *                   description: define o poder do usuário dentro do sistema
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: todos os campos são obrigatórios 
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou acesso negado
 *       409:
 *         description: E-mail ja foi cadastrado no sistema
 */
router.put('/user/:id', authenticateToken, authorizeRole(['admin']), atualizarUsuario);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login na aplicação
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: O e-mail do usuário
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: A senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna o token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: O token JWT para autenticação
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', login);

module.exports = router;
