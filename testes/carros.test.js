const request = require('supertest');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const app = require('../app'); 

let carroId;
let gerenteToken;

describe('POST /carros', () => {
  beforeAll(async () => {
    await pool.execute('DELETE FROM usuarios');

    const hashedPassword = await bcrypt.hash('senha123', 10);
    await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
      ['Gerente Teste', 'gerente@teste.com', hashedPassword, 'gerente']
    );

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'gerente@teste.com',
        senha: 'senha123',
      });

    gerenteToken = loginRes.body.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Deve criar um carro com sucesso', async () => {
    const novoCarro = {
      marca: 'Ferrari',
      modelo: '488 Pista',
      categoria: 'Esportivo',
      ano: 2022,
      cor: 'Rosso Corsa',
      quilometragem: 0,
      potencia: 720,
      motor: 'V8 Biturbo',
      zero_a_cem: 2.85,
      velocidade_final: 340,
      preco: 3500000.00,
      numero_portas: 2,
      tipo_tracao: 'Traseira',
      consumo_medio: '8 km/l',
      status: 'Disponível',
      caracteristicas: 'Aerodinâmica aprimorada, Interior luxuoso',
    };

    const res = await request(app)
      .post('/carros')
      .set('Authorization', `Bearer ${gerenteToken}`)
      .send(novoCarro);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(novoCarro);
    carroId = res.body.id;
  });

  it('Deve listar todos os carros', async () => {
    const res = await request(app)
      .get('/carros')
      .set('Authorization', `Bearer ${gerenteToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Deve obter um carro pelo ID', async () => {
    const res = await request(app)
      .get(`/carros/${carroId}`)
      .set('Authorization', `Bearer ${gerenteToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(carroId);
  });

  it('Deve atualizar um carro com sucesso', async () => {
    const carroAtualizado = {
      marca: 'Ferrari',
      modelo: '488 Spider',
      categoria: 'Esportivo',
      ano: 2023,
      cor: 'Rosso Scuderia',
      quilometragem: 500,
      potencia: 720,
      motor: 'V8 Biturbo',
      zero_a_cem: 2.8,
      velocidade_final: 340,
      preco: 3700000.00,
      numero_portas: 2,
      tipo_tracao: 'Traseira',
      consumo_medio: '8 km/l',
      status: 'Disponível',
      caracteristicas: 'Conversível, Sistema de som premium',
    };

    const res = await request(app)
      .put(`/carros/${carroId}`)
      .set('Authorization', `Bearer ${gerenteToken}`)
      .send(carroAtualizado);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(carroAtualizado);
  });

  it('Deve excluir um carro com sucesso', async () => {
    const res = await request(app)
      .delete(`/carros/${carroId}`)
      .set('Authorization', `Bearer ${gerenteToken}`);

    expect(res.status).toBe(204);
  });

  it('Deve retornar erro ao buscar carro excluído', async () => {
    const res = await request(app)
      .get(`/carros/${carroId}`)
      .set('Authorization', `Bearer ${gerenteToken}`);

    expect(res.status).toBe(404);
  });
});
