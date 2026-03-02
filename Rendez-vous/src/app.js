const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rendezvous', routes);

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'Rendez-vous Service running', port: process.env.PORT });
});

const PORT = process.env.PORT || 8082;

// Démarrer
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Service démarré sur port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Erreur DB:', err.message);
});