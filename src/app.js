const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/', (req, res) => {
  res.json({
    message: 'DevOps U2 - Pipeline CI/CD funcionando',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: 'DevOps U2',
    description: 'Aplicación de ejemplo para Actividad 3 - Fundamentos DevOps',
    tools: ['GitHub', 'GitHub Actions', 'Docker', 'Jenkins', 'Kubernetes']
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
