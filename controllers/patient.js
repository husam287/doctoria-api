const Patient = require('../models/patients');
const User = require('../models/users');
const Doctor = require('../models/doctors');
const Appointment = require('../models/appointments');
const Review = require('../models/reviews');
const uError = require("../utils/uError");
const getDateFromDay = require('../utils/getDateFromDay');

//edit basic information
exports.editSecondryInfo = async (req, res, next) => {
  const patientId = req.userId;

  const chronicDiseases = req.body.chronicDiseases;
  // for first time
  try {
    const user = await User.findById(patientId);
    if (!user) uError(404, 'Could not find User');
    if (!user.userDetails) {
      const newpatient = new Patient({ basicInfo: patientId, chronicDiseases: chronicDiseases });
      const pat = await newpatient.save();
      res.status(200).json({ message: 'Patient updated!', chronicDiseases: pat.chronicDiseases });
    }
  } catch (error) {
    next(error);
    return;
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
      res.status(200).json({ message: 'patient updated!', chronicDiseases: result.chronicDiseases });
    })
    .catch(err => {
      next(err);
    });
}
exports.viewASpecificPatient = (req, res, next) => {

  Patient.findOne({ basicInfo: req.params.patientId })
    .select('-_id -appointments -history._id')
    .populate({
      path: 'basicInfo',
      select: '-email -password -userDetails'
    })
    .populate({
      path: 'history.doctor',
      select: '-_id fees area speciality basicInfo',
      populate: {
        path: 'basicInfo',
        select: 'name _id photo'
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
    .select('-_id -appointments._id')
    .populate('basicInfo', '-email -password -userDetails')
    .populate('appointments.details', '-patient')
    .populate({
      path: 'appointments.doctor history.doctor',
      select: '-_id -patients -appointments -reviews -timeslot',
      populate: {
        path: 'basicInfo',
        select: 'name _id photo'
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
      path: 'history.doctor',
      select: '-_id -patients -appointments -reviews -timeslot',
      populate: {
        path: 'basicInfo',
        select: 'name _id photo'
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
    .populate('appointments.details', '-patient')
    .populate({
      path: 'appointments.doctor',
      select: '-_id -patients -appointments -reviews -timeslot',
      populate: {
        path: 'basicInfo',
        select: '-userDetails -email -password'
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





exports.postMakeAppointment = async (req, res, next) => {

  const doctorId = req.params.doctorId;
  let patient;
  let appointment;

  Doctor.findOne({ basicInfo: doctorId })
    .then(async (doctor) => {
      if (!doctor) uError(404, 'doctor not found');
      const dayDate = getDateFromDay(req.body.day, req.body.time);
      patient = await Patient.findOne({ basicInfo: req.userId });
      appointment = new Appointment({ patient: patient._id, date: dayDate });
      appointment.save();
      doctor.appointments.push(appointment._id);
      return doctor.save();
    })
    .then((doctor) => {
      const patientAppointment = { details: appointment._id, doctor: doctor._id }
      patient.appointments.push(patientAppointment);
      return patient.save();
    })
    .then(() => {
      res.status(200).json({ message: 'Made an appointment!', appointment: appointment });
    })
    .catch(err => {
      next(err);
    });
}



exports.postCancelAppointment = (req, res, next) => {
  const appointmentId = req.params.appointmentId;

  let targetDoctorId;
  Patient.findOne({ basicInfo: req.userId })
    .then(patient => {
      if (!patient) uError(404, "patient not found");
      let flag = true;
      patient.appointments.every((element, i) => {
        if (element.details.toString() === appointmentId.toString()) {
          targetDoctorId = element.doctor;
          patient.appointments.splice(i, 1);
          flag = false;
          return false;
        }
        return true;
      });

      if (flag) uError(404, "appointment doesn't exist");
      return patient.save();
    })
    .then(() => {
      return Doctor.findById(targetDoctorId)
    })
    .then(doctor => {
      let flag = true;
      doctor.appointments.every((element, i) => {
        if (element.toString() === appointmentId.toString()) {
          doctor.appointments.splice(i, 1);
          flag = false;
          return false;
        }
        return true;
      });
      if (flag) uError(404, "appointment doesn't exist");
      return doctor.save()
    })
    .then(() => {
      return Appointment.findByIdAndRemove(appointmentId);
    })
    .then(() => {
      res.status(200).json({ message: "Appointment is been cancelled!!" });
    })
    .catch(err => {
      next(err);
    })

};



exports.postReview = (req, res, next) => {
  const doctorId = req.params.doctorId;
  const review = new Review(req.body);

  Doctor.findOne({ basicInfo: doctorId })
    .then((doctor) => {
      if (!doctor) uError(404, "doctor not found")
      doctor.reviews.push(review._id);
      return doctor.save();
    })
    .then(() => {
      review.save();
      res.status(200).json(review);
    })
    .catch(err => {
      next(err);
    });
};

