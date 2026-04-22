const { Pool } = require('pg');

// Supabase usa SSL, por eso añadimos el objeto ssl
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para Supabase/Vercel
  }
});

const initDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conectado a Supabase:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Error conectando a la DB:', err);
    throw err;
  }
};

module.exports = { pool, initDB };