require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDB = require('./config/initDB');

// ── Rutas ─────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth.routes');
const usersRoutes        = require('./routes/users.routes');
const petsRoutes         = require('./routes/pets.routes');
const remindersRoutes    = require('./routes/reminders.routes');
const healthRoutes       = require('./routes/healthRecords.routes');
const routinesRoutes     = require('./routes/routines.routes');

const app = express();

// ── Middlewares globales ──────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' })); // 10 MB para imágenes en base64

// ── Rutas de la API ───────────────────────────────────────────
app.use('/api/auth',           authRoutes);
app.use('/api/users',          usersRoutes);
app.use('/api/pets',           petsRoutes);
app.use('/api/reminders',      remindersRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/routines',       routinesRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── 404 ───────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// ── Error handler global ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ── Arrancar servidor ─────────────────────────────────────────
const PORT = process.env.PORT || 3001;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 Endpoints disponibles:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/me`);
      console.log(`   GET    /api/users          (admin)`);
      console.log(`   GET    /api/pets`);
      console.log(`   GET    /api/reminders`);
      console.log(`   GET    /api/health-records`);
      console.log(`   GET    /api/routines`);
    });
  })
  .catch((err) => {
    console.error('No se pudo inicializar la base de datos:', err);
    process.exit(1);
  });
