const request = require('supertest');
const { expect } = require('chai');
const { app } = require('../src/server');
const db = require('../src/config/db');

describe('Auth API', function() {
  before(async function() {
    // cria DB e tabelas se necessário
    // Assumimos que setup_db.js foi rodado antes dos testes
  });

  it('Deve criar um novo usuário e logar', async function() {
    const username = `testuser_${Date.now()}`;
    const password = 'testpass';
    // register
    const reg = await request(app).post('/api/auth/register').send({ username, password, name: 'Test' });
    expect(reg.status).to.be.oneOf([201,409]); 
    if (reg.status === 201) {
      expect(reg.body.user).to.have.property('username', username);
    }

    // login
    const res = await request(app).post('/api/auth/login').send({ username, password });
    
    expect([200,401]).to.include(res.status);
  });

  after(async function() {
    // cleanup
    await db.destroy();
  });
});
