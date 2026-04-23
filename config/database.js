const { Pool } = require('pg');

// Configuración robusta para Render y otros entornos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_NO_SSL === 'true' ? false : {
    rejectUnauthorized: false 
  }
});

const initDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a la Base de Datos con DATABASE_URL');
    return true;
  } catch (err) {
    console.error('❌ Error de conexión a la Base de Datos:', err.message);
    throw err;
  }
};

module.exports = { pool, initDB };