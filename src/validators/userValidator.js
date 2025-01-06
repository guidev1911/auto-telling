const Joi = require('joi');

const userSchema = Joi.object({
    nome: Joi.string().max(100),
    email: Joi.string().max(50),
    senha: Joi.string().max(30),
    nivel: Joi.string().valid('gerente','admin','vendedor').required(),
});

module.exports = userSchema;