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

  it('Deverá resgistrar usuário novo com sucesso', async () => {
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

  it('Deverá retornar um erro informando que todos os campos são obrigatórios', async () => {
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

  it('Deverá retornar um erro que existe esse e-mail já está registrado', async () => {
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
