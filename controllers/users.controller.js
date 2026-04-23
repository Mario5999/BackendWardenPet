const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// GET /api/users  (admin)
const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, role, created_at, last_login
       FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// GET /api/users/:id  (admin)
const getUserById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, role, created_at, last_login
       FROM users WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// PUT /api/users/:id  (admin)
const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let query, params;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query = `UPDATE users SET name=$1, email=$2, password=$3, role=$4
               WHERE id=$5
               RETURNING id, name, email, role, created_at, last_login`;
      params = [name, email, hashed, role, req.params.id];
    } else {
      query = `UPDATE users SET name=$1, email=$2, role=$3
               WHERE id=$4
               RETURNING id, name, email, role, created_at, last_login`;
      params = [name, email, role, req.params.id];
    }

    const { rows } = await pool.query(query, params);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// DELETE /api/users/:id  (admin)
const deleteUser = async (req, res) => {
  try {
    // No permitir que el admin se elimine a sí mismo
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }

    const { rowCount } = await pool.query(
      'DELETE FROM users WHERE id = $1', [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
