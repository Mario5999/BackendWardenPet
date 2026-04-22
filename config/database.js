const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ── ESTO ES LO QUE FALTA ─────────────────────────────────────
  ssl: {
    rejectUnauthorized: false // Esto permite la conexión con certificados de Supabase
  }
});

module.exports = pool;