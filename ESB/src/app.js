const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// ⚠️ IMPORTANT : Ne PAS utiliser express.json() avant les proxies !
// Le body doit rester brut pour le proxy
app.use(cors());
app.use(morgan('dev'));

// Health check (avant les proxies)
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway running', port: process.env.PORT });
});

app.get('/', (req, res) => {
  res.json({
    message: 'MyHeart API Gateway',
    services: [
      { path: '/api/patients', target: process.env.PATIENT_SERVICE_URL },
      { path: '/api/rendezvous', target: process.env.RENDEZVOUS_SERVICE_URL },
      { path: '/api/factures', target: process.env.FACTURATION_SERVICE_URL },
      { path: '/api/analyses', target: process.env.LABORATOIRE_SERVICE_URL },
      { path: '/api/pharmacie', target: process.env.PHARMACIE_SERVICE_URL },
      { path: '/api/notifications', target: process.env.NOTIFICATION_SERVICE_URL }
    ]
  });
});

// Configuration des proxies
const services = [
  { path: '/api/patients', target: process.env.PATIENT_SERVICE_URL || 'http://localhost:8081' },
  { path: '/api/rendezvous', target: process.env.RENDEZVOUS_SERVICE_URL || 'http://localhost:8082' },
  { path: '/api/factures', target: process.env.FACTURATION_SERVICE_URL || 'http://localhost:8083' },
  { path: '/api/analyses', target: process.env.LABORATOIRE_SERVICE_URL || 'http://localhost:8084' },
  { path: '/api/pharmacie', target: process.env.PHARMACIE_SERVICE_URL || 'http://localhost:8085' },
  { path: '/api/notifications', target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8086' }
];

services.forEach(({ path, target }) => {
  console.log(`📡 Routing ${path} → ${target}`);
  
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    // ⚠️ Pas de pathRewrite !
    // ⚠️ Pas d'express.json() avant !
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${target}${req.originalUrl}`);
    },
    onError: (err, req, res) => {
      console.error(`❌ Proxy error: ${err.message}`);
      res.status(503).json({
        success: false,
        message: `Service indisponible`,
        error: err.message
      });
    }
  }));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 API Gateway sur le port ${PORT}`);
});

module.exports = app;