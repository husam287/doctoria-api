const router = require('express').Router();
const doctorsController = require('../controllers/doctors');
const isAuth = require('../middelwares/isAuth');
const { vEmail, vPassword, vRepeated, vText, validationResult } = require('../middelwares/validation')
const { body } = require('express-validator');


router.post('/test', doctorsController.test);

router.get('/all', doctorsController.viewAllDoctors);


router.get('/my-profile', [isAuth], doctorsController.ViewProfile);

router.put(
  '/my-profile/edit-secondary-info',
  [isAuth,
    body('area')
    .trim(),
    body('fees')
    .trim()
    .isNumeric(),
    body('speciality').trim()
  ],
  doctorsController.editSecondaryInfo
  );
  
  router.get('/my-profile/my-patients', [isAuth], doctorsController.ViewMyPatients);
  
  router.get('/:doctorId', doctorsController.viewASpecificDoctor);




module.exports = router;
