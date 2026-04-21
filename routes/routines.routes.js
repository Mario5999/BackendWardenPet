const router = require('express').Router();
const {
  getRoutines, getRoutineById,
  createRoutine, updateRoutine, deleteRoutine
} = require('../controllers/routines.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', getRoutines);
router.get('/:id', getRoutineById);
router.post('/', createRoutine);
router.put('/:id', updateRoutine);
router.delete('/:id', deleteRoutine);

module.exports = router;
