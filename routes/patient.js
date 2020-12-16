const express = require('express');
const { body } = require('express-validator/check');
const patientController = require('../controllers/patient');
const router = express.Router();

// من غير middleware auth


// edit second
router.get('/:patientId', patientController.getEditSecondaryInformation);
router.post('/:patientId', patientController.postEditSecondaryInformation);


// make appointment
//router.get('/doctor/:doctorId/make-Appointment', patientController.getMakeAppointment);

router.post('/doctorId-main-page/make-Appointment', patientController.postMakeAppointment);


// cancel appointment
//router.get('/patient/cancelAppointment', patientController.getCancelAppointment);
router.post('/cancelAppointment', patientController.postCancelAppointment);


// make review
//router.get('/doctor/:doctorId', patientController.getReview);
router.post('/doctorId-main-page', patientController.postReview);


module.exports = router;
// use middleware validator

/*router.post(
    '/post',
    [
        body('title')
            .trim()
            .isLength({ min: 7 }),
        body('content')
            .trim()
            .isLength({ min: 5 })
    ],
    feedController.createPost
);*/