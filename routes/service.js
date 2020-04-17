const { Router } = require('express');
const ServiceController = require('../controllers/Service');
const router = Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const reset = require('../middlewares/reset');

router.post('/createPass', auth, ServiceController.createPass);
router.get('/getAllPass', auth, ServiceController.getAllPass);
router.get('/getApprover', ServiceController.getApprover);
router.get('/getPass', auth, ServiceController.getPass);
router.post('/updateState', auth, ServiceController.updateState);

module.exports = router;
