const request = require('supertest');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const app = require('../app');

describe('POST /auth/register', () => {
  beforeAll(async () => {
    await pool.execute('DELETE FROM usuarios');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should register a new user successfully', async () => {
    const newUser = {
      nome: 'Novo Usuário',
      email: 'novo@example.com',
      senha: '123456',
      nivel: 'gerente',
    };

    const res = await request(app).post('/auth/register').send(newUser);

    expect(res.status).toBe(201); 
    expect(res.body.message).toBe('Usuário registrado com sucesso!');
  });

  it('should return error if required fields are missing', async () => {
    const incompleteUser = {
      nome: 'Usuário Incompleto',
      email: '', 
      senha: '123456',
      nivel: 'gerente',
    };

    const res = await request(app).post('/auth/register').send(incompleteUser);

    expect(res.status).toBe(400); 
    expect(res.body.message).toBe('Todos os campos são obrigatórios.');
  });

  it('should return error if email is already in use', async () => {
    const duplicateUser = {
      nome: 'Novo Usuário',
      email: 'novo@example.com', 
      senha: '123456',
      nivel: 'gerente',
    };

    const res = await request(app).post('/auth/register').send(duplicateUser);

    expect(res.status).toBe(409); 
    expect(res.body.message).toBe('O e-mail já está em uso.');
  });
});
