const router = require('express').Router();
const doctorsController = require('../controllers/doctors');
const isAuth = require('../middelwares/isAuth');
const { vEmail, vPassword, vRepeated, vText, validationResult } = require('../middelwares/validation')
const {body} = require('express-validator');


router.post('/test',doctorsController.test);
router.get('/allDoctors',doctorsController.viewAllDoctors);
router.get('/doctor/:doctorId',doctorsController.viewASpecificDoctor);

router.put(
    '/doctor/:doctorId',
    [ isAuth,
      body('area')
        .trim(),
      body('fees')
        .trim()
        .isNumeric(),
        body('speciality').trim()
    ],
    doctorsController.editSecondaryInfo
  );

  router.get('/doctor/profile/',[
      isAuth],doctorsController.ViewProfile);
  router.get('/doctor/profile/myPatients',[isAuth],doctorsController.ViewMyPatients);





module.exports = router;
