const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashed]
    );

    const user = rows[0];
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado en variables de entorno');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Actualizar último login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado en variables de entorno');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };
