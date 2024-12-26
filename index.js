require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const Joi = require('joi');

const carroSchema = Joi.object({
    marca: Joi.string().max(50).required(),
    modelo: Joi.string().max(100).required(),
    categoria: Joi.string().max(50).required(),
    ano: Joi.number().integer().min(1886).max(new Date().getFullYear()).required(), 
    cor: Joi.string().max(30).required(),
    quilometragem: Joi.number().integer().min(0).required(),
    potencia: Joi.string().max(50).required(),
    motor: Joi.string().max(50).required(),
    zero_a_cem: Joi.number().min(0).required(),
    velocidade_final: Joi.number().min(0).required(),
    preco: Joi.number().precision(2).min(0).required(),
    numero_portas: Joi.number().integer().min(2).max(5).required(),
    tipo_tracao: Joi.string().valid('Dianteira', 'Traseira', 'Integral').required(),
    consumo_medio: Joi.string().max(20).required(),
    status: Joi.string().valid('Disponível', 'Indisponível').required(),
    caracteristicas: Joi.string().max(1000),
});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

app.post('/carros', (req, res) => {

    const { error } = carroSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
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
        if (err) {
            return res.status(500).send({ error: 'Erro ao adicionar carro!' });
        }
        res.status(201).send({ id: result.insertId, ...req.body });
    });
});

app.get('/carros', (req, res) => {
    const sql = 'SELECT * FROM carros';
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Erro ao buscar carros!' });
        }
        res.send(results);
    });
});

app.get('/carros/:id', (req, res) => {
    
    const { error } = carroSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    const { id } = req.params;
    const sql = 'SELECT * FROM carros WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Erro ao buscar carro!' });
        }
        if (results.length === 0) {
            return res.status(404).send({ error: 'Carro não encontrado!' });
        }
        res.send(results[0]);
    });
});

app.put('/carros/:id', (req, res) => {

    const { error } = carroSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
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
        if (err) {
            return res.status(500).send({ error: 'Erro ao atualizar carro!' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Carro não encontrado!' });
        }
        res.send({ id, ...req.body });
    });
});

app.delete('/carros/:id', (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM carros WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Erro ao deletar carro!' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Carro não encontrado!' });
        }
        res.status(204).send();
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

