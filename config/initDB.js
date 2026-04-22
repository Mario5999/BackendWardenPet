// ════════════════════════════════════════════════════════════════
// initDB.js - Inicialización de la base de datos
// ════════════════════════════════════════════════════════════════

// ⚠️ IMPORTANTE: Si en database.js pusiste module.exports = { pool, ... }
// entonces aquí debes usar destructuración: const { pool } = require('./database');
const { pool } = require('./database'); 

async function initDB() {
  try {
    console.log('⏳ Verificando conexión a la base de datos en la nube...');
    
    // Realizar una query simple para verificar la conexión
    const result = await pool.query('SELECT NOW()');
    
    console.log('✅ Base de datos conectada correctamente (Supabase)');
    console.log('   Timestamp del servidor:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('❌ Error crítico al conectar con Supabase:');
    console.error('   Mensaje:', error.message);
    
    // Estos mensajes ya no aplican a Docker, sino a la Nube:
    console.error('   Revisa que DATABASE_URL en Vercel sea la correcta.');
    
    throw error;
  }
}

module.exports = initDB;