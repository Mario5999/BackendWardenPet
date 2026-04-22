require('dotenv').config();
const express = require('express');
const { initDB } = require('./config/database');

// ── Importar rutas ────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const petsRoutes = require('./routes/pets.routes');
const remindersRoutes = require('./routes/reminders.routes');
const healthRoutes = require('./routes/healthRecords.routes');
const routinesRoutes = require('./routes/routines.routes');

const app = express();

// ── CORS manual (compatible con Vercel) ───────────────────────
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://frontend-warden-pet.vercel.app',
    'http://localhost:3000',
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder preflight inmediatamente
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json({ limit: '10mb' }));

// ── Rutas de la API ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/routines', routinesRoutes);

// ── Root ──────────────────────────────────────────────────────
app.get('/', (_, res) => {
  res.json({
    message: '🐾 WardenPet Backend funcionando correctamente',
    status: 'ok',
    version: '1.0.0',
  });
});

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', async (_, res) => {
  try {
    await initDB();
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', message: 'DB no disponible', error: err.message });
  }
});

// ── 404 y Error Handler ───────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ── Lógica de Arranque (Local vs Vercel) ──────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  initDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Error inicializando base de datos:', err);
    });
} else {
  initDB().catch(err => console.error('DB Error en Vercel:', err));
}

module.exports = app;