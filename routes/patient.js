const router = require('express').Router();
const patientsController = require('../controllers/patient');
const isAuth = require('../middelwares/isAuth');
const { vEmail, vPassword, vRepeated, vText, validationResult } = require('../middelwares/validation')
const { body } = require('express-validator');



router.get('/my-profile', [isAuth], patientsController.ViewMyProfile);
router.get('/my-profile/my-history', [isAuth], patientsController.ViewMyhistory);
router.get('/my-profile/my-appointments', [isAuth], patientsController.ViewMyAppointments);
router.get('/:patientId', patientsController.viewASpecificPatient);



router.put(
 '/my-profile/edit-secondary-info',
  [isAuth],
  patientsController.editSecondryInfo);


router.post('/make-appointment/:doctorId',[isAuth,vText('day',{required:true})], patientsController.postMakeAppointment);



router.delete('/cancel-appointment/:appointmentId',[isAuth], patientsController.postCancelAppointment);


router.post('/make-review',[isAuth], patientsController.postReview);


module.exports = router;

