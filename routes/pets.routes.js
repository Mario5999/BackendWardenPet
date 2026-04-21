const router = require('express').Router();
const { getPets, getPetById, createPet, updatePet, deletePet } = require('../controllers/pets.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
