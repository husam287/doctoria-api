const router = require('express').Router();
const patientsController = require('../controllers/patient');
const isAuth = require('../middelwares/isAuth');
const { vEmail, vPassword, vRepeated, vText, validationResult } = require('../middelwares/validation')
const { body } = require('express-validator');



router.get('/my-profile', [isAuth], patientsController.ViewProfile);
router.get('/my-profile/my-history', [isAuth], patientsController.ViewProfile);
router.get('/my-profile/my-appointments', [isAuth], patientsController.ViewProfile);
router.get('/:patientId', patientsController.viewASpecificPatient);



router.put(
 '/my-profile/edit-secondary-info',
  [isAuth,
    body('chronicDiseases')
    .trim(),
  ],
  patientsController.editSecondaryInfo
  );

module.exports = router;