const request = require('supertest');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const app = require('../app');

describe('POST /auth/register', () => {
  let adminToken;

  beforeAll(async () => {
    await pool.execute('DELETE FROM usuarios');

    const hashedPassword = await bcrypt.hash('admin_password', 10);
    await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@gmail.com', hashedPassword, 'admin']
    );

    const res = await request(app).post('/auth/login').send({
      email: 'admin@gmail.com',
      senha: 'admin_password',
    });

    adminToken = res.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Deverá registrar um novo usuário com sucesso', async () => {
    const newUser = {
      nome: 'Usuário Teste',
      email: 'teste@gmail.com',
      senha: '123456',
      nivel: 'vendedor',
    };
  
    const res = await request(app)
      .post('/auth/register')
      .set('Authorization', `Bearer ${adminToken}`) 
      .send(newUser);
  
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Usuário registrado com sucesso!');
  
    const [rows] = await pool.promise().execute('SELECT * FROM usuarios WHERE email = ?', [newUser.email]);
  
    expect(rows).toHaveLength(1);
    expect(rows[0].nome).toBe(newUser.nome);
    expect(await bcrypt.compare(newUser.senha, rows[0].senha)).toBe(true);
  });  

  it('Deverá retornar um erro informando que todos os campos são obrigatórios', async () => {
    const incompleteUser = {
      nome: 'Usuário Incompleto',
      email: '', 
      senha: '123456',
      nivel: 'vendedor',
    };

    const res = await request(app)
      .post('/auth/register')
      .set('Authorization', `Bearer ${adminToken}`) 
      .send(incompleteUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Todos os campos são obrigatórios.');
  });

  it('Deverá retornar um erro caso o e-mail já esteja registrado', async () => {
    const duplicateUser = {
      nome: 'Admin User',
      email: 'admin@gmail.com', 
      senha: '123456',
      nivel: 'admin',
    };

    const res = await request(app)
      .post('/auth/register')
      .set('Authorization', `Bearer ${adminToken}`) 
      .send(duplicateUser);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('O e-mail já está em uso.');
  });

  it('Deverá retornar um erro caso o usuário não tenha nível de acesso adequado', async () => {

    const hashedPassword = await bcrypt.hash('senha1234', 10);
    await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
      ['UsuarioComum', 'user@gmail.com', hashedPassword, 'vendedor']
    );

    const loginRes = await request(app).post('/auth/login').send({
      email: 'user@gmail.com',
      senha: 'senha1234',
    });

    const userToken = loginRes.body.token;

    const res = await request(app)
      .post('/auth/register')
      .set('Authorization', `Bearer ${userToken}`) 
      .send({
        nome: 'Outro Usuário',
        email: 'outro@gmail.com',
        senha: '123456',
        nivel: 'vendedor',
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acesso negado!');
  });
});
