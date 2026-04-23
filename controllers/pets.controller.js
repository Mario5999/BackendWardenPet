const { pool } = require('../config/database');

// GET /api/pets
const getPets = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM pets WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getPets error:', err);
    res.status(500).json({ message: 'Error al obtener mascotas' });
  }
};

// GET /api/pets/:id
const getPetById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM pets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Mascota no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getPetById error:', err);
    res.status(500).json({ message: 'Error al obtener mascota' });
  }
};

// POST /api/pets
const createPet = async (req, res) => {
  const { name, type, age, breed, weight, image } = req.body;

  if (!name || !type || age === undefined) {
    return res.status(400).json({ message: 'Nombre, tipo y edad son requeridos' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO pets (user_id, name, type, age, breed, weight, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, name, type, age, breed || null, weight || null, image || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createPet error:', err);
    res.status(500).json({ message: 'Error al crear mascota' });
  }
};

// PUT /api/pets/:id
const updatePet = async (req, res) => {
  const { name, type, age, breed, weight, image } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE pets
       SET name=$1, type=$2, age=$3, breed=$4, weight=$5, image=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`,
      [name, type, age, breed || null, weight || null, image || null, req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Mascota no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('updatePet error:', err);
    res.status(500).json({ message: 'Error al actualizar mascota' });
  }
};

// DELETE /api/pets/:id
const deletePet = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM pets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'Mascota no encontrada' });
    res.json({ message: 'Mascota eliminada correctamente' });
  } catch (err) {
    console.error('deletePet error:', err);
    res.status(500).json({ message: 'Error al eliminar mascota' });
  }
};

module.exports = { getPets, getPetById, createPet, updatePet, deletePet };
