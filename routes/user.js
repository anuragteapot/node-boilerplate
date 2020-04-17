const { Router } = require('express');
const UserController = require('../controllers/User');
const router = Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const reset = require('../middlewares/reset');

router.get('/', auth, UserController.getByToken);
router.post('/', UserController.create);
router.post('/acl', auth, admin, UserController.acl);
router.get('/getAllAdmin', auth, UserController.getAllAdmin);
router.put('/', reset, UserController.update);

module.exports = router;
