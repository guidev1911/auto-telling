const Joi = require('joi');

const carroSchema = Joi.object({
    marca: Joi.string().max(50).required(),
    modelo: Joi.string().max(100).required(),
    categoria: Joi.string().max(50).required(),
    ano: Joi.number().integer().min(1886).max(new Date().getFullYear()).required(),
    cor: Joi.string().max(30).required(),
    quilometragem: Joi.number().integer().min(0).required(),
    potencia: Joi.number().min(0).required(),
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

module.exports = carroSchema;
