const getDateFromDay = require("../utils/getDateFromDay");
const Doctor = require('../models/doctors');
const User = require('../models/users');
const Appointment = require('../models/appointments');
const Timeslot = require('../models/timeslots');
const { validationResult } = require('express-validator');
const uError = require("../utils/uError");
const { populate } = require("../models/appointments");


exports.test = (req, res, next) => {
  console.log(getDateFromDay('Sunday'));
  next();
}



exports.viewAllDoctors = (req, res, next) => {
  //View all doctors in search.
  Doctor.find()
    .select('-_id -appointments -patients')
    .populate('basicInfo', '-email -password -userDetails')
    .then(doctors => {
      if (doctors.length <= 0) {
        const error = new Error('Could not find any doctors.');
        error.statusCode = 404;
        throw error;
      }
      //if doctors are found ,render them to the page.
      res
        .status(200)
        .json(doctors);
    })
    .catch(err => {
      next(err);
    });

}

exports.viewASpecificDoctor = (req, res, next) => {
  //viewing a specific doctor's profile
  const doctorId = req.params.doctorId;
  Doctor.findOne({ basicInfo: doctorId })
    .select('-_id -appointments -patients')
    .populate('basicInfo timeslot', '-email -password')
    .then(doctor => {
      if (!doctor) {
        const error = new Error('Could not find doctor.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(doctor);
    })
    .catch(err => {
      next(err);
    });
};

exports.editSecondaryInfo = async (req, res, next) => {
  //editing doctor's secondary information
  const doctorId = req.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const area = req.body.area;
  const speciality = req.body.speciality;
  const fees = req.body.fees;

  //if first time for him 
  try {
    const user = await User.findById(doctorId);
    console.log(doctorId);
    if (!user) uError(404, 'Could not find doctor');
    if (!user.userDetails) {
      const newDoctor = new Doctor({ basicInfo: doctorId, fees: fees, area: area, speciality: speciality });
      const docDoc = await newDoctor.save();
      user.userDetails = newDoctor._id;
      user.save()
      res.status(200).json({ message: 'doctor updated!', doctor: docDoc });
    }
  } catch (error) {
    next(error);
  }


  Doctor.findOne({ basicInfo: doctorId })
    .then(doctor => {
      if (!doctor) {
        const error = new Error('Could not find doctor.');
        error.statusCode = 404;
        throw error;
      }

      doctor.area = area;
      doctor.speciality = speciality;
      doctor.fees = fees;
      return doctor.save();
    })
    .then(result => {
      res.status(200).json({ message: 'doctor updated!', doctor: result });
    })
    .catch(err => {
      next(err);
    });
};


exports.ViewProfile = (req, res, next) => {
  //Doctor can view his profile
  const userId = req.userId;
  Doctor.findOne({ basicInfo: userId })
    .select('-_id')
    .populate('basicInfo timeslot reviews', '-email -password -userDetails')
    .populate({
      path:'appointments',
      populate:{
        path:'patient',
        select:'-_id -appointments -history',
        populate:{
          path:'basicInfo',
          select:'name _id photo'
        }
      }
    })
    .then(doctor => {
      if (!doctor) {
        const error = new Error('Could not find doctor.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(doctor);
    })
    .catch(err => {
      next(err);
    });
};


exports.ViewMyPatients = (req, res, next) => {
  const doctorId = req.userId;
  Doctor.findOne({ basicInfo: doctorId })
    .select('patients')
    .populate({
      path: 'patients',
      select: '-appointment -history',
      populate: {
        path: 'basicInfo',
        select: '-email -password'
      }
    })
    .then(doctor => {
      if (!doctor) {
        const error = new Error('Could not find doctor.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(doctor.patients);
    })
    .catch(err => {
      next(err);
    });

};



exports.getAppointments = (req, res, next) => {

  Doctor.findOne({ basicInfo: req.userId })
    .populate('appointments')
    .then(doctor => {
      res.status(202).json(doctor.appointments);
    })
    .catch(err => {
      next(err);
    })
}

exports.markCompleted = (req, res, next) => {

  let appointmentPatientId;
  let thisDoctor;

  Doctor.findOne({ basicInfo: req.userId })
    .then(doctor => {
      thisDoctor = doctor;
      let flag = 0;
      doctor.appointments.forEach(element => {
        if (element.toString() === req.params.id.toString()) {
          flag = 1;
        }
      });
      if (!flag) uError(400, 'not in my appointments');

      return Appointment.findById(req.params.id);
    })
    .then(appointment => {
      appointment.completed = true;
      appointmentPatientId = appointment.patient;
      return appointment.save()
    })
    .then(() => {
      let flag = 0;
      thisDoctor.patients.forEach(i => {
        if (i.toString() === appointmentPatientId.toString()) {
          flag = 1;
        }
      });

      if (!flag) { thisDoctor.patients.push(appointmentPatientId); }

      return thisDoctor.save();
    })
    .then(() => {
      res.status(202).json({ message: "Marked As Completed Sucessfully!!" });
    })
    .catch(err => {
      next(err);
    })
}


exports.referPatient = async (req, res, next) => {

  if (!req.query.doctor || !req.query.appointment) uError(400, "Bad Query");
  const doctor = req.query.doctor;
  const appointment = req.query.appointment;

  const name = await User.findById().name;

  Doctor.findOne({ basicInfo: req.userId })
    .then(doctor => {
      let flag = 0;
      doctor.appointments.forEach((element, i) => {
        if (element.toString() === req.params.id.toString()) {
          flag = 1;
          doctor.appointments.splice(i, 1);
        }
      });
      if (!flag) uError(400, 'not in my appointments');

      return Appointment.findById(appointment);
    })
    .then(appointment => {
      appointment.referred = true;
      appointment.date = null;
      return appointment.save()
    })
    .then(() => {
      return Doctor.findOne({ basicInfo: doctor })
    })
    .then((refDoc) => {
      refDoc.appointments.push(appointment)
      return refDoc.save()
    })
    .then(() => {
      res.status(202).json({ message: `Referred To ${name}` })
    })
    .catch(err => {
      next(err);
    })
}


exports.editTimeSlot = async (req, res, next) => {

  const days = req.body.days;
  const slots = req.body.slots;

  const doctor = await Doctor.findOne({ basicInfo: req.userId });
  if (doctor.timeslot) {
    Timeslot.findById(doctor.timeslot)
      .then(timeslot => {
        timeslot.days = days
        timeslot.slots = slots;
        return timeslot.save()
      })
      .then(doc => {
        res.status(202).json(doc);
      })
      .catch(err => {
        next(err);
      })

  } else {
    const timeslot = new Timeslot({ days: days, slots: slots });
    timeslot.save()
      .then(doc => {
        doctor.timeslot = doc._id;
        return doctor.save();
      })
      .then(doc => {
        res.status(202).json(timeslot);
      })
      .catch(err => {
        next(err);
      })
  }
}


