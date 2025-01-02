const request = require('supertest');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const app = require('../app');

describe('POST /auth/login', () => {
    beforeAll(async () => {
        await pool.execute('DELETE FROM usuarios');

        const senhaHash = await bcrypt.hash('senha123', 10);

        await pool.execute('INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)', [
            'Usuário Teste',
            'teste@example.com',
            senhaHash,
            'gerente',
        ]);
    });

    afterAll(async () => {
        await pool.end();
    });

    it('Deve retornar um token para credenciais válidas', async () => {
        const loginData = {
            email: 'teste@example.com',
            senha: 'senha123',
        };

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Deve retornar erro 401 para email inválido', async () => {
        const loginData = {
            email: 'invalido@example.com',
            senha: 'senha123',
        };

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Credenciais inválidas!');
    });

    it('Deve retornar erro 401 para senha inválida', async () => {
        const loginData = {
            email: 'teste@example.com',
            senha: 'senhaErrada',
        };

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Credenciais inválidas!');
    });
});
