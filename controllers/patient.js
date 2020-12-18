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
exports.viewASpecificPatient = (req,res,next)=>{

  Patient.findOne({basicInfo:req.params.patientId})
  .select('-_id -appointments')
  .populate({
    path:'basicInfo',
    select:'-email -password -userDetails',
    populate:{
      path:'history.doctor',
      select:'fees area speciality basicInfo',
      populate:{
        path:'history.doctor.basicInfo',
        select:'name _id photo'
      }
    }
  })
  .then(patient=>{
    if(!patient) uError(404,'Patient not found');

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