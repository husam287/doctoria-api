const getDateFromDay = require("../utils/getDateFromDay");
const Doctors = require('../models/doctors');

exports.test = (req, res, next) => {
    console.log(getDateFromDay('Sunday'));
    next();
}



exports.viewAllDoctors = (req,res,next) => {
//View all doctors in search.
Doctors.find()
    .then(doctors => {
        //if doctors are found ,render them to the page.
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', doctors: doctors });
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
        res.status(200).json({ message: 'doctor fetched.', doctor: doctor });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };