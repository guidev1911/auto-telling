const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const userSchema = require('../validators/userValidator');

const registrarUsuario = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const { nome, email, senha, nivel } = req.body;

    if (!nome || !email || !senha || !nivel) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await pool.promise().query(query, [email]);

        if (rows.length > 0) {
            return res.status(409).json({ message: 'O e-mail já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const insertQuery = 'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)';
        const [result] = await pool.promise().query(insertQuery, [nome, email, hashedPassword, nivel]);

        const io = req.app.get("io");
        io.emit("usersUpdated");
        res.status(201).json({ message: 'Usuário registrado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar o usuário.' });
    }
};

const deletarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteQuery = 'DELETE FROM usuarios WHERE id = ?';
        const [result] = await pool.promise().query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const io = req.app.get("io");
        io.emit("usersUpdated");
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar o usuário.' });
    }
};

const atualizarUsuario = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const { id } = req.params;
    const { nome, email, senha, nivel } = req.body;

    if (!nome || !email || !nivel) {
        return res.status(400).json({ message: 'Nome, email e nível são obrigatórios.' });
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE id = ?';
        const [rows] = await pool.promise().query(query, [id]);

        const query2 = 'SELECT * FROM usuarios WHERE id != ? AND email = ?';
        const [rows2] = await pool.promise().query(query2, [id, email]);        

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        if (rows2.length > 0) {
            return res.status(409).json({ message: 'O e-mail já está em uso.' });
        }

        let updateQuery = 'UPDATE usuarios SET nome = ?, email = ?, nivel = ?';
        const queryParams = [nome, email, nivel];

        if (senha) {
            const hashedPassword = await bcrypt.hash(senha, 10);
            updateQuery += ', senha = ?';
            queryParams.push(hashedPassword);
        }

        updateQuery += ' WHERE id = ?';
        queryParams.push(id);

        await pool.promise().query(updateQuery, queryParams);

        const io = req.app.get("io");
        io.emit("usersUpdated");
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
    }
};

const buscarTodosUsuarios = async (req, res) => {
    try {
        const query = 'SELECT id, nome, email, nivel FROM usuarios';
        const [rows] = await pool.promise().query(query);

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar os usuários.' });
    }
};

const buscarUsuarioPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT id, nome, email, nivel FROM usuarios WHERE id = ?';
        const [rows] = await pool.promise().query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o usuário.' });
    }
};

module.exports = {
    registrarUsuario,
    deletarUsuario,
    atualizarUsuario,
    buscarTodosUsuarios,
    buscarUsuarioPorId,
};
