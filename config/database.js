const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ⚠️ ESTO ES OBLIGATORIO PARA LA NUBE
  ssl: {
    rejectUnauthorized: false 
  }
});

const initDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conectado a Supabase correctamente');
    return true;
  } catch (err) {
    console.error('❌ Error de conexión a la BD:', err.message);
    throw err;
  }
};

module.exports = { pool, initDB };