// ════════════════════════════════════════════════════════════════
// initDB.js - Inicialización de la base de datos
// ════════════════════════════════════════════════════════════════

const pool = require('./database');

async function initDB() {
  try {
    console.log('⏳ Verificando conexión a la base de datos...');
    
    // Realizar una query simple para verificar la conexión
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Base de datos conectada correctamente');
    console.log('   Timestamp del servidor:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:');
    console.error('   Asegúrate de que:');
    console.error('   1. Docker está ejecutando el contenedor wardenpet-db');
    console.error('   2. Las variables de entorno en .env son correctas');
    console.error('   3. Puedes ejecutar: docker-compose up -d (en la carpeta Base de datos)');
    throw error;
  }
}

module.exports = initDB;
