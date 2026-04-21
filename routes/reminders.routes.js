const router = require('express').Router();
const {
  getReminders, getReminderById, createReminder,
  toggleReminder, updateReminder, deleteReminder
} = require('../controllers/reminders.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', getReminders);
router.get('/:id', getReminderById);
router.post('/', createReminder);
router.patch('/:id/toggle', toggleReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
