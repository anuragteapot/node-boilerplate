const { Router } = require('express');
const UserController = require('../controllers/User');
const router = Router();
const auth = require('../middlewares/auth');
const reset = require('../middlewares/reset');

router.get('/', auth, UserController.getByToken);
router.post('/', UserController.create);
router.put('/', reset, UserController.update);

module.exports = router;
