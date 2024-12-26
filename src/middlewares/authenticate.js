const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token não fornecido!' });

    try {
        const decoded = jwt.verify(token, 'sua_chave_secreta');
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido!' });
    }
};

const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.nivel)) {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    next();
};

module.exports = { authenticateToken, authorizeRole };
