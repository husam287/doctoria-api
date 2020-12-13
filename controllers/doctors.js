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