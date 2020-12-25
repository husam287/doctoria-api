const getDateFromDay = require("../utils/getDateFromDay");
const Doctor = require('../models/doctors');
const Patient = require('../models/patients');
const User = require('../models/users');
const Appointment = require('../models/appointments');
const Timeslot = require('../models/timeslots');
const { validationResult } = require('express-validator');
const uError = require("../utils/uError");


exports.test = (req, res, next) => {
  console.log(getDateFromDay('Sunday'));
  next();
}



exports.viewAllDoctors = (req, res, next) => {
  //View all doctors in search.
  Doctor.find()
    .select('-_id -appointments -patients')
    .populate('reviews','-_id -updatedAt')
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
    .populate('timeslot reviews','-_id -updatedAt')
    .populate('basicInfo', '-email -password -userDetails')
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
    .populate('timeslot reviews','-_id -updatedAt')
    .populate('basicInfo', '-email -password -userDetails')
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
      select: '-_id -appointments -history',
      populate: {
        path: 'basicInfo',
        select: 'name _id photo'
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
    .populate({
      path:'appointments',
      populate:{
        path:'patient',
        select:'-_id basicInfo',
        populate:{path:'basicInfo',select:'name _id photo'}
      }
    })
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
      let flag = 1;
      doctor.appointments.every(element => {
        if (element.toString() === req.params.id.toString()) {
          flag = 0;
          return false;
        }
        return true;
      });
      if (flag) uError(400, 'not in my appointments');

      return Appointment.findById(req.params.id);
    })
    .then(appointment => {
      appointment.completed = true;
      appointmentPatientId = appointment.patient;
      return appointment.save()
    })
    .then(() => {
      let flag = 1;
      thisDoctor.patients.every(i => {
        if (i.toString() === appointmentPatientId.toString()) {
          flag = 0;
          return false;
        }
        return true;
      });

      if (flag) { thisDoctor.patients.push(appointmentPatientId); }

      thisDoctor.save();
      return Patient.findById(appointmentPatientId);
    })
    .then((patient) => {
      const history = {doctor:thisDoctor._id,date:Date.now()}
      patient.history.push(history);
      patient.save();
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

  let name = await User.findById(doctor);
  name=name.name;

  let specialIdOfDoctor;
  try {
    const appointmentCompletion = await Appointment.findById(appointment);
    if(!appointmentCompletion) uError(404,"no appointment");
    if(appointmentCompletion.completed) uError(400,"Completed Appointment");
    
  } catch (error) {
    next(error);
  }

  Doctor.findOne({ basicInfo: req.userId })
    .then(doctor => {
      
      let flag = 1;
      doctor.appointments.every((element, i) => {
        if (element.toString() === appointment.toString()) {
          flag = 0;
          doctor.appointments.splice(i, 1);
          return false;
        }
        return true;
      });
      if (flag) uError(400, 'not in my appointments');

      doctor.save();
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
    .then(async(refDoc) => {
      refDoc.appointments.push(appointment)
      refDoc.save()

      appDoc = await Appointment.findById(appointment);
      patient = await Patient.findById(appDoc.patient);
      patient.appointments.every((element)=>{
        if(element.details.toString()===appointment.toString()){
          element.doctor=refDoc._id;
          return false
        }
        return true;
      });

      patient.save();
      res.status(202).json({ message: `Referred To ${name}` })
    })
    .catch(err => {
      next(err);
    })
}


exports.editTimeSlot = async (req, res, next) => {

  const days = req.body.days;
  const slots = req.body.slots;
  let doctor;
  
  try{
    doctor = await Doctor.findOne({ basicInfo: req.userId });
    if(!doctor) uError(404,"Doctor Not found");
  }catch(error){
    next(error)
  }
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


