// اللينكات تقريبا كلها غلط

// declaration
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const review = require('../models/review');
const { validationResult } = require('express-validator/check');
const appointment = require('../models/appointment');

// edit sec info\
 // basic info
exports.getEditSecondaryInformation = (req, res,next) => {
    const patientId = req.userId;
    Patient.findOne(patientId)
    //Patient.findById(patientId)
        .then(patient => {
            if (!patient) {
                const error = new Error('he5a');
                error.statusCode = 404;
            }
            res.statusCode(200).json({
                chronicDiseases: patientId.chronicDiseases
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
            //console.log(err);
        });
};


exports.postEditSecondaryInformation = (req, res, next) => {
    const patientId = req.userId;
   // const patientId = req.parms.patientId;
    const errors = validationResult(req);
    Patient.findOne(patientId)
        .then(patient => {
            if (!patient) {
                const error = new Error('he5a');
                error.statusCode = 404;
                throw error;
            }
            const updatedChronicDiseases = req.body.chronicDiseases;
            patient.chronicDiseases = updatedChronicDiseases;
            res.status(200)
                // be Id wla men 9er
                .json({ chronicDiseases: patientId.chronicDiseases });
            return patient.save();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
            //console.log(err);
        });
};




exports.postMakeAppointment = (req, res, next) => {
    // info from server date ,patientId
    // get doc id
    // add patent to app array in doctor
    const doctorId = req.params.userId;
    const errors = validationResult(req);
    Doctor.findOne(doctorId)
        .then(doctor => {
            if (!doctor) {
                const error = new Error('The doctor cannot be found');
                error.statusCode = 404;
                throw error;
            }
            // patient auth
            const appointment = new appointment({////
                // men body?////
                patient: req.body.patient,////
                doctor: doctorId,///
                // date: req.date,
                date: req.body.date,////
                timeslot: req.body.timeslot//// name from database
            })
            doctor.appointment.push(appointment);
            res.statusCode(200).json({ message: 'hehe' });
            return doctor.save;
        })
        .then(() => {//////// name app men patient database
            patient.appointment.push(appointment);
            res.statusCode(200).json({ message: 'hehe' });
            return patient.save();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

/*exports.gg = () => {
    for (int v; v < 10;v++) {
    }
}*/
/*
const loopy = (m) => {
    for (int i; i < m; i++)
    {
    }

        }*/

exports.postCancelAppointment =  (req, res, next) => {
    // patient auth
    // or from params
    const appointmentId = req.params.appointmentId;
    // da men user wla body
    const doctorId = req.body.userId;
    const patientId = req.userId;
    const errors = validationResult(req);
    Doctor.findOne(doctorId)
        .then(appointmentId => {
            if (!appointmentId) {
                const error = new Error('The appointment cannot be found');
                error.statusCode = 404;
                throw error;
            }
            // appointments shema standalone
            appointment.findByIdAndRemove(appointmentId);
            res.statusCode(200);
            return appointment.save();
        })
        .then(doctor => {
            if (!doctor) {
                const error = new Error('The doctor cannot be found');
                error.statusCode = 404;
                throw error;
            }
            // remove from doc array of patients
            // remove app from doctor database

            for (var i = 0; i <= appointments.count+1; i++) {
                if (doctor.appointments[i] == appointmentId) {
                    // de btegb index we tsheel wahd
                    appointments.splice(i, 1);
                }
            }
            res.statusCode(200);
            return doctor.save();

           // Doctor.appointments.findByIdAndRemove(appointmentId);
          //  Doctor.patients.findByIdAndRemove(patientId);
        })
        .then(() => {
            // patient
            for (var i = 0; i <= appointments.count + 1; i++) {
                if (patient.appointments[i] == appointmentId) {
                    // de btegb index we tsheel wahd
                    appointments.splice(i, 1);
                }
            }
            res.statusCode(200);
            return patient.save();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};



exports.postReview = (req, res,next) => {
    const doctorId = req.params.userId;
    //
    const Stars = req.body.star;////////////////////////
    Doctor.findOne(doctorId)
        .then(doctor => {
            if (!doctor) {
                const error = new Error('The doctor cannot be found');
                error.statusCode = 404;
                throw error;
            }
            doctor.review = Stars;
            res.statusCode(200).json({ message: 'hehe' });
            return doctor.save();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};



// or doctorId main page



// cancel appointment
/*exports.getCancelAppointment = (req, res, next) => {
    // auth
    //
    const doctorId = req.params.doctorId;

};*/


// make appointment
/*
exports.getMakeAppointment = (req, res, next) => {
    // mesh 3aref el link
    res.render('doctor/make-appointment', {
        pageTitle: 'doctor',
        path: ' ',

    });
};*/
/*
 *
exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('err');
        error.statusCode = 422;
        throw error;
    }
    const tilte=req.body.tiltle
    const post = new Post({
        title: title
    });
    post.save().then(result => {
        res.statusCode(201).json({
            message: 'mea mea',
            post: result
        });
    })
        .catch(err => { consloe.log(err) });
};*/

/*
 exports.postEditSecondaryInformation = (req, res, next) => {
    const patientId = req.params.patientId;
    const errors = validationResult(req);
    Patient.findById(patientId)
        .then(patient => {
            if (!patient) {
                const error = new Error('he5a');
                error.statusCode = 404;
                throw error;
            }
            const updatedChronicDiseases = req.body.chronicDiseases;
            patient.chronicDiseases = updatedChronicDiseases;
            return patient.save();
        })
        .then(result => {////
            res.redirect('/patient/profile');
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
            //console.log(err);
        });
};*/