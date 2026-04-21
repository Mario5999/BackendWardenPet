const pool = require('../config/database');

// GET /api/routines
const getRoutines = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, p.name AS pet_name
       FROM routines r
       JOIN pets p ON p.id = r.pet_id
       WHERE r.user_id = $1
       ORDER BY r.time ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getRoutines error:', err);
    res.status(500).json({ message: 'Error al obtener rutinas' });
  }
};

// GET /api/routines/:id
const getRoutineById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM routines WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getRoutineById error:', err);
    res.status(500).json({ message: 'Error al obtener rutina' });
  }
};

// POST /api/routines
const createRoutine = async (req, res) => {
  const { pet_id, type, time, description } = req.body;

  if (!pet_id || !type || !time || !description) {
    return res.status(400).json({ message: 'pet_id, tipo, hora y descripción son requeridos' });
  }

  try {
    const pet = await pool.query(
      'SELECT id FROM pets WHERE id = $1 AND user_id = $2',
      [pet_id, req.user.id]
    );
    if (pet.rows.length === 0) return res.status(404).json({ message: 'Mascota no encontrada' });

    const { rows } = await pool.query(
      `INSERT INTO routines (user_id, pet_id, type, time, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, pet_id, type, time, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createRoutine error:', err);
    res.status(500).json({ message: 'Error al crear rutina' });
  }
};

// PUT /api/routines/:id
const updateRoutine = async (req, res) => {
  const { type, time, description } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE routines SET type=$1, time=$2, description=$3
       WHERE id=$4 AND user_id=$5
       RETURNING *`,
      [type, time, description, req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('updateRoutine error:', err);
    res.status(500).json({ message: 'Error al actualizar rutina' });
  }
};

// DELETE /api/routines/:id
const deleteRoutine = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM routines WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.json({ message: 'Rutina eliminada correctamente' });
  } catch (err) {
    console.error('deleteRoutine error:', err);
    res.status(500).json({ message: 'Error al eliminar rutina' });
  }
};

module.exports = { getRoutines, getRoutineById, createRoutine, updateRoutine, deleteRoutine };
