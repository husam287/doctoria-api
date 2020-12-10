const router = require('express').Router();
const doctorsController = require('../controllers/doctors');
const { vEmail, vPassword, vRepeated, vText, validationResult } = require('../middelwares/validation')
const {body} = require('express-validator');


router.post('/test',doctorsController.test);





module.exports = router;
