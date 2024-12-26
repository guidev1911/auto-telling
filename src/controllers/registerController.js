const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

const  registrarUsuario = async (req, res) => {

    const { nome, email, senha, nivel } = req.body;

    if (!nome || !email || !senha || !nivel) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const query = 'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)';
        await pool.execute(query, [nome, email, hashedPassword, nivel]);

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar o usuário.' });
    }
};

module.exports = { registrarUsuario };