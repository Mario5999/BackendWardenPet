const pool = require('../config/database');

// GET /api/health-records
const getHealthRecords = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT hr.*, p.name AS pet_name
       FROM health_records hr
       JOIN pets p ON p.id = hr.pet_id
       WHERE hr.user_id = $1
       ORDER BY hr.date DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getHealthRecords error:', err);
    res.status(500).json({ message: 'Error al obtener registros de salud' });
  }
};

// GET /api/health-records/:id
const getHealthRecordById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM health_records WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getHealthRecordById error:', err);
    res.status(500).json({ message: 'Error al obtener registro de salud' });
  }
};

// POST /api/health-records
const createHealthRecord = async (req, res) => {
  const { pet_id, date, symptoms, notes, temperature } = req.body;

  if (!pet_id || !date || !symptoms) {
    return res.status(400).json({ message: 'pet_id, fecha y síntomas son requeridos' });
  }

  try {
    const pet = await pool.query(
      'SELECT id FROM pets WHERE id = $1 AND user_id = $2',
      [pet_id, req.user.id]
    );
    if (pet.rows.length === 0) return res.status(404).json({ message: 'Mascota no encontrada' });

    const { rows } = await pool.query(
      `INSERT INTO health_records (user_id, pet_id, date, symptoms, notes, temperature)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, pet_id, date, symptoms, notes || null, temperature || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createHealthRecord error:', err);
    res.status(500).json({ message: 'Error al crear registro de salud' });
  }
};

// PUT /api/health-records/:id
const updateHealthRecord = async (req, res) => {
  const { date, symptoms, notes, temperature } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE health_records SET date=$1, symptoms=$2, notes=$3, temperature=$4
       WHERE id=$5 AND user_id=$6
       RETURNING *`,
      [date, symptoms, notes || null, temperature || null, req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('updateHealthRecord error:', err);
    res.status(500).json({ message: 'Error al actualizar registro de salud' });
  }
};

// DELETE /api/health-records/:id
const deleteHealthRecord = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM health_records WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json({ message: 'Registro de salud eliminado correctamente' });
  } catch (err) {
    console.error('deleteHealthRecord error:', err);
    res.status(500).json({ message: 'Error al eliminar registro de salud' });
  }
};

module.exports = { getHealthRecords, getHealthRecordById, createHealthRecord, updateHealthRecord, deleteHealthRecord };
