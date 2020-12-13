const getDateFromDay = require("../utils/getDateFromDay");
const Doctors = require('../models/doctors');
const { validationResult } = require('express-validator/check');


exports.test = (req, res, next) => {
    console.log(getDateFromDay('Sunday'));
    next();
}



exports.viewAllDoctors = (req,res,next) => {
//View all doctors in search.
Doctors.find()
    .then(doctors => {
        if (!doctors) {
            const error = new Error('Could not find any doctors.');
            error.statusCode = 404;
            throw error;
          }
        //if doctors are found ,render them to the page.
      res
        .status(200)
        .json({ message: 'Fetched doctors successfully.', doctors: doctors });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}

exports.viewASpecificDoctor = (req, res, next) => {
    //viewing a specific doctor's profile
    const doctorId = req.params.doctorId;
    Doctors.findById(doctorId)
      .then(doctor => {
        if (!doctor) {
          const error = new Error('Could not find doctor.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'doctor fetched.', 
        doctor:doctor });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.editSecondaryInfo = (req, res, next) => {
      //editing doctor's secondary information
    const doctorId = req.params.doctorId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const area = req.body.area;
    const speciality = req.body.speciality;
    const fees = req.body.fees;
    Doctors.findById(postId)
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
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  

  exports.ViewProfile = (req, res, next) => {
    //Doctor can view his profile
    const userId = req.userId;
    Doctors.findById(userId)
      .then(doctor => {
        if (!doctor) {
          const error = new Error('Could not find doctor.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'doctor fetched.', 
        doctor: doctor });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };


  exports.ViewMyPatients = (req,res,next) => {
    const doctorId = req.params.doctorId;
    Doctors.findById(doctorId)
      .then(doctor => {
        if (!doctor) {
          const error = new Error('Could not find doctor.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'doctor fetched.', 
        doctor: doctor });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });

  };


