const router = require('express').Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/users.controller');
const { authenticate, adminOnly } = require('../middlewares/auth.middleware');

router.use(authenticate, adminOnly);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;