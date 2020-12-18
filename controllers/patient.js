const Patient = require('../models/patients');
const User = require('../models/users');
const uError = require("../utils/uError");

//edit basic information
exports.editSecondryInfo = async (req, res, next) => {
  const patientId = req.userId;

  const chronicDiseases = req.body.chronicDiseases;
  // for first time
  try {
    const user = await User.findById(patientId);
    if (!user) uError(404, 'Could not find patient');
    if (!user.userDetail) {
      const newpatient = new Patient({ basicInfo: patientId, chronicDiseases: chronicDiseases });
      const pat = await newpatient.save();
      res.status(200).json({ message: 'Patient updated!', patient: pat });
    }
  } catch (error) {
    next(error);
  }

  Patient.findOne({ basicInfo: patientId })
    .then(patient => {
      if (!patient) {
        const error = new Error('Could not find patient.');
        error.statusCode = 404;
        throw error;
      }

      patient.chronicDiseases = chronicDiseases;

      return patient.save();
    })
    .then(result => {
      res.status(200).json({ message: 'patient updated!', patient: result });
    })
    .catch(err => {
      next(err);
    });
}
exports.viewASpecificPatient = (req, res, next) => {

  Patient.findOne({ basicInfo: req.params.patientId })
    .select('-_id -appointments')
    .populate({
      path: 'basicInfo',
      select: '-email -password -userDetails',
      populate: {
        path: 'history.doctor',
        select: 'fees area speciality basicInfo',
        populate: {
          path: 'history.doctor.basicInfo',
          select: 'name _id photo'
        }
      }
    })
    .then(patient => {
      if (!patient) uError(404, 'Patient not found');

      res.status(200).json(patient);
    })
}

//Patient  can view his profile
exports.ViewMyProfile = (req, res, next) => {
  const userId = req.userId;
  Patient.findOne({ basicInfo: userId })
    .select('-_id')
    .populate({
      path: 'basicInfo appointments.doctor appointments.details history.doctor',
      select: '-email -password -userDetails',
      populate: {
        path: 'history.doctor.basicInfo appointments.doctor.basicInfo appointments.details',
        select: '-email -password -patient'
      }
    })
    .then(patient => {
      if (!patient) {
        const error = new Error('Could not find patient.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(patient);
    })
    .catch(err => {
      next(err);
    });
};


//patient can view his history
exports.ViewMyhistory = (req, res, next) => {
  const patientId = req.userId;
  Patient.findOne({ basicInfo: patientId })
    .select('history')
    .populate({
      path: 'doctors',
      select: 'speciality fees area',
      populate: {
        path: 'basicInfo',
        select: 'name photo _id'
      }
    })
    .then(patient => {
      if (!patient) {
        const error = new Error('Could not find patient.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(patient.history);
    })
    .catch(err => {
      next(err);
    });
}
//patient can view Appointments
exports.ViewMyAppointments = (req, res, next) => {
  const patientId = req.userId;
  Patient.findOne({ basicInfo: patientId })
    .select('appointments')
    .populate({
      path: 'doctors',
      select: 'speciality fees area',
      populate: {
        path: 'basicInfo',
        select: 'name photo _id'
      }
    })
    .then(patient => {
      if (!patient) {
        const error = new Error('Could not find patient.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(patient.appointments);
    })
    .catch(err => {
      next(err);
    });
}





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



exports.postCancelAppointment = (req, res, next) => {
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

      for (var i = 0; i <= appointments.count + 1; i++) {
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



exports.postReview = (req, res, next) => {
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
      next(err);
    });
};

