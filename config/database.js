// ════════════════════════════════════════════════════════════════
// database.js - Configuración de conexión a PostgreSQL
// ════════════════════════════════════════════════════════════════

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'wardenpet_user',
  password: process.env.DB_PASSWORD || 'wardenpet_secure_pass',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'wardenpet_db',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err);
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

module.exports = pool;
