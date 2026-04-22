const { Pool } = require('pg');

// Usamos connectionString para que lea la URL larga directamente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

const initDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a Supabase con DATABASE_URL');
    return true;
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    throw err;
  }
};

module.exports = { pool, initDB };