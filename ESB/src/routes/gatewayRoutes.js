const { createProxyMiddleware } = require('http-proxy-middleware');

const services = [
  {
    path: '/api/patients',
    target: process.env.PATIENT_SERVICE_URL,
    name: 'Patient Service'
  },
  {
    path: '/api/rendezvous',
    target: process.env.RENDEZVOUS_SERVICE_URL,
    name: 'Rendez-vous Service'
  },
  {
    path: '/api/factures',
    target: process.env.FACTURATION_SERVICE_URL,
    name: 'Facturation Service'
  },
  {
    path: '/api/analyses',
    target: process.env.LABORATOIRE_SERVICE_URL,
    name: 'Laboratoire Service'
  },
  {
    path: '/api/pharmacie',
    target: process.env.PHARMACIE_SERVICE_URL,
    name: 'Pharmacie Service'
  },
  {
    path: '/api/notifications',
    target: process.env.NOTIFICATION_SERVICE_URL,
    name: 'Notification Service'
  }
];

function setupGatewayRoutes(app) {
  services.forEach(({ path, target, name }) => {
    console.log(`📡 Routing ${path} → ${target}`);
    
    app.use(path, createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path, req) => req.originalUrl,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${target}`);
      },
      onError: (err, req, res) => {
        console.error(`❌ Erreur proxy ${name}:`, err.message);
        res.status(503).json({
          success: false,
          message: `Service ${name} indisponible`,
          error: err.message
        });
      }
    }));
  });

  return services;
}

module.exports = { setupGatewayRoutes, services };