const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await pool.promise().execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        const user = rows[0];
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        }
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        }

        const token = jwt.sign(
            { id: user.id, nivel: user.nivel },
            'sua_chave_secreta', 
            { expiresIn: '8h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao autenticar o usuário.' });
    }
};

module.exports = { login };



