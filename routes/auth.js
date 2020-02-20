const { Router } = require('express');
const AuthController = require('../controllers/Auth');
const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgetPassword', AuthController.forgetPassword);
router.post('/verifyEmail', AuthController.verifyEmail);

module.exports = router;
