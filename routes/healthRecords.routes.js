const router = require('express').Router();
const {
  getHealthRecords, getHealthRecordById,
  createHealthRecord, updateHealthRecord, deleteHealthRecord
} = require('../controllers/healthRecords.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', getHealthRecords);
router.get('/:id', getHealthRecordById);
router.post('/', createHealthRecord);
router.put('/:id', updateHealthRecord);
router.delete('/:id', deleteHealthRecord);

module.exports = router;
