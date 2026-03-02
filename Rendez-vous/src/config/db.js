const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Créer la table si elle n'existe pas
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rendez_vous (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL,
      medecin_id INTEGER NOT NULL,
      date_heure TIMESTAMP NOT NULL,
      motif VARCHAR(255) NOT NULL,
      statut VARCHAR(20) DEFAULT 'EN_ATTENTE',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table rendez_vous prête');
};

module.exports = { pool, initDB };