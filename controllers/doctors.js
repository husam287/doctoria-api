const getDateFromDay = require("../utils/getDateFromDay");
const Doctor = require('../models/doctors');
const User = require('../models/users');
const { validationResult } = require('express-validator');
const uError = require("../utils/uError");


exports.test = (req, res, next) => {
    console.log(getDateFromDay('Sunday'));
    next();
}



exports.viewAllDoctors = (req,res,next) => {
//View all doctors in search.
Doctor.find()
.select('-_id -appointments -patients')
.populate('basicInfo','-email -password')
    .then(doctors => {
        if (doctors.length<=0) {
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
    Doctor.findOne({basicInfo:doctorId})
    .select('-_id -appointments -patients')
    .populate('basicInfo','-email -password')
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
      if(!user) uError(404,'Could not find doctor');
      if(!user.userDetail) {
        const newDoctor = new Doctor({basicInfo:doctorId,fees:fees,area:area,speciality:speciality});
        const docDoc = await newDoctor.save();
        res.status(200).json({ message: 'doctor updated!', doctor: docDoc });
      }
    } catch (error) {
      next(error);
    }


    Doctor.findOne({basicInfo:doctorId})
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
    Doctor.findOne({basicInfo:userId})
    .select('-_id -patients -appointments')
    .populate('basicInfo timeslot reviews','-email -password')
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


  exports.ViewMyPatients = (req,res,next) => {

    //doctor can view his patients
    const doctorId = req.userId;
    Doctor.findOne({basicInfo:doctorId})
    .select('patients')
    .populate({
      path:'patients',
      select:'-appointment -history',
      populate:{
        path:'basicInfo',
        select:'-email -password'
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


