const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const pharmacieRoutes = require('./routes/pharmacieRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pharmacie', pharmacieRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Pharmacie Service running!', port: process.env.PORT });
});

const PORT = process.env.PORT || 8085;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL réussie');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');
    
    app.listen(PORT, () => {
      console.log(`🚀 Pharmacie Service démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

startServer();