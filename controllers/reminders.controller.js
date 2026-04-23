const { pool } = require('../config/database');

// GET /api/reminders
const getReminders = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, p.name AS pet_name
       FROM reminders r
       JOIN pets p ON p.id = r.pet_id
       WHERE r.user_id = $1
       ORDER BY r.date ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getReminders error:', err);
    res.status(500).json({ message: 'Error al obtener recordatorios' });
  }
};

// GET /api/reminders/:id
const getReminderById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM reminders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getReminderById error:', err);
    res.status(500).json({ message: 'Error al obtener recordatorio' });
  }
};

// POST /api/reminders
const createReminder = async (req, res) => {
  const { pet_id, type, title, description, date } = req.body;

  if (!pet_id || !type || !title || !date) {
    return res.status(400).json({ message: 'pet_id, tipo, título y fecha son requeridos' });
  }

  try {
    // Verificar que la mascota pertenezca al usuario
    const pet = await pool.query(
      'SELECT id FROM pets WHERE id = $1 AND user_id = $2',
      [pet_id, req.user.id]
    );
    if (pet.rows.length === 0) return res.status(404).json({ message: 'Mascota no encontrada' });

    const { rows } = await pool.query(
      `INSERT INTO reminders (user_id, pet_id, type, title, description, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, pet_id, type, title, description || null, date]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createReminder error:', err);
    res.status(500).json({ message: 'Error al crear recordatorio' });
  }
};

// PATCH /api/reminders/:id/toggle
const toggleReminder = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE reminders SET completed = NOT completed
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('toggleReminder error:', err);
    res.status(500).json({ message: 'Error al actualizar recordatorio' });
  }
};

// PUT /api/reminders/:id
const updateReminder = async (req, res) => {
  const { type, title, description, date, completed } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE reminders SET type=$1, title=$2, description=$3, date=$4, completed=$5
       WHERE id=$6 AND user_id=$7
       RETURNING *`,
      [type, title, description || null, date, completed, req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('updateReminder error:', err);
    res.status(500).json({ message: 'Error al actualizar recordatorio' });
  }
};

// DELETE /api/reminders/:id
const deleteReminder = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM reminders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.json({ message: 'Recordatorio eliminado correctamente' });
  } catch (err) {
    console.error('deleteReminder error:', err);
    res.status(500).json({ message: 'Error al eliminar recordatorio' });
  }
};

module.exports = { getReminders, getReminderById, createReminder, toggleReminder, updateReminder, deleteReminder };
