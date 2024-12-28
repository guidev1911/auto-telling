const request = require('supertest');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const app = require('../app');

describe('POST /auth/login', () => {
    beforeAll(async () => {
        // Limpa a tabela e insere um usuário de teste antes de todos os testes
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
        // Fecha a conexão do banco após os testes
        await pool.end();
    });

    it('Deverá retornar um token para credenciais válidas', async () => {
        const loginData = {
            email: 'teste@example.com',
            senha: 'senha123',
        };

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Deverá retornar erro 401 para email inválido', async () => {
        const loginData = {
            email: 'invalido@example.com',
            senha: 'senha123',
        };

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Credenciais inválidas!');
    });

    it('Deverá retornar erro 401 para senha inválida', async () => {
        const loginData = {
            email: 'teste@example.com',
            senha: 'senhaErrada',
        };

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Credenciais inválidas!');
    });
});
