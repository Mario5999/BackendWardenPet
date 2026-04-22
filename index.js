require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/database'); // Asegúrate de que la ruta sea correcta

// ── Rutas ─────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth.routes');
const usersRoutes        = require('./routes/users.routes');
const petsRoutes         = require('./routes/pets.routes');
const remindersRoutes    = require('./routes/reminders.routes');
const healthRoutes       = require('./routes/healthRecords.routes');
const routinesRoutes     = require('./routes/routines.routes');

const app = express();

// ── Middlewares globales ──────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); 

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

// ── 404 y Error Handler ───────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ── Lógica de Arranque (Local vs Vercel) ───────────────────────
if (process.env.NODE_ENV !== 'production') {
  // En local inicializamos la DB y prendemos el server
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
  // En producción (Vercel), solo inicializamos la conexión a la DB
  // Vercel llamará a la app automáticamente
  initDB().catch(err => console.error('DB Error en Vercel:', err));
}

// SIEMPRE AL FINAL
module.exports = app;