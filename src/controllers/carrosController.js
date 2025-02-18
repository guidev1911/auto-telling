const connection = require('../config/database');
const carroSchema = require('../validators/carroValidator');

const getAllCarros = (req, res) => {
    const sql = 'SELECT * FROM carros';
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).send({ error: 'Erro ao buscar carros!' });
        res.send(results);
    });
};

const getCarroById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM carros WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).send({ error: 'Erro ao buscar carro!' });
        if (results.length === 0) return res.status(404).send({ error: 'Carro não encontrado!' });
        res.send(results[0]);
    });
};

const createCarro = (req, res) => {
    const { error } = carroSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const {
        marca, modelo, categoria, ano, cor, quilometragem, potencia, motor,
        zero_a_cem, velocidade_final, preco, numero_portas, tipo_tracao,
        consumo_medio, status, caracteristicas
    } = req.body;

    const sql = `INSERT INTO carros (marca, modelo, categoria, ano, cor, quilometragem,
        potencia, motor, zero_a_cem, velocidade_final, preco, numero_portas,
        tipo_tracao, consumo_medio, status, caracteristicas) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [
        marca, modelo, categoria, ano, cor, quilometragem, potencia, motor,
        zero_a_cem, velocidade_final, preco, numero_portas, tipo_tracao,
        consumo_medio, status, caracteristicas
    ], (err, result) => {
        if (err) return res.status(500).send({ error: 'Erro ao adicionar carro!' });
        const io = req.app.get("io");
        io.emit("carrosUpdated");
        res.status(201).send({ id: result.insertId, ...req.body });
    });
};

const updateCarro = (req, res) => {
    const { error } = carroSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const { id } = req.params;
    const {
        marca, modelo, categoria, ano, cor, quilometragem, potencia, motor,
        zero_a_cem, velocidade_final, preco, numero_portas, tipo_tracao,
        consumo_medio, status, caracteristicas
    } = req.body;

    const sql = `UPDATE carros SET marca = ?, modelo = ?, categoria = ?, ano = ?, cor = ?, 
        quilometragem = ?, potencia = ?, motor = ?, zero_a_cem = ?, velocidade_final = ?, 
        preco = ?, numero_portas = ?, tipo_tracao = ?, consumo_medio = ?, status = ?, 
        caracteristicas = ? WHERE id = ?`;

    connection.query(sql, [
        marca, modelo, categoria, ano, cor, quilometragem, potencia, motor,
        zero_a_cem, velocidade_final, preco, numero_portas, tipo_tracao,
        consumo_medio, status, caracteristicas, id
    ], (err, result) => {
        if (err) return res.status(500).send({ error: 'Erro ao atualizar carro!' });
        if (result.affectedRows === 0) return res.status(404).send({ error: 'Carro não encontrado!' });
        const io = req.app.get("io");
        io.emit("carrosUpdated");
        res.send({ id, ...req.body });
    });
};

const deleteCarro = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM carros WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send({ error: 'Erro ao deletar carro!' });
        if (result.affectedRows === 0) return res.status(404).send({ error: 'Carro não encontrado!' });
        const io = req.app.get("io");
        io.emit("carrosUpdated");
        res.status(204).send();
    });
};

module.exports = { getAllCarros, getCarroById, createCarro, updateCarro, deleteCarro };
