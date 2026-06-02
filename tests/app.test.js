const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('debe retornar mensaje de bienvenida', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Pipeline CI/CD');
  });
});

describe('GET /health', () => {
  it('debe retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/info', () => {
  it('debe retornar información de la app', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('tools');
    expect(Array.isArray(res.body.tools)).toBe(true);
  });
});
