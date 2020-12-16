const patient = require('../models/patients');
const User = require('../models/users');
const { validationResult } = require('express-validator');
const uError = require("../utils/uError");
const getDateFromDay = require("../utils/getDateFromDay");

//edit basic information
exports.editSecondryInfo = async (req ,res ,next)=> {
    const patientId =req.UserId ;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const chronicDiseases =req.body.chronicDiseases;
    // for first time
    try {
        const user = await User.findById(patientId);
        console.log(patientId);
        if(!user) uError(404,'Could not find patient');
        if(!user.userDetail) {
          const newpatient = new patient({basicInfo:patientId,chronicDiseases:chronicDiseases});
          const pat = await newpatient.save();
          res.status(200).json({ message: 'Patient updated!', patient: pat });
        }
      } catch (error) {
        next(error);
      }

      patient.findOne({basicInfo:patientId})
      .then(patient => {
        if (!patient) {
          const error = new Error('Could not find patient.');
          error.statusCode = 404;
          throw error;
        }

          patient.chronicDiseases=chronicDiseases;   
                    
        return patient.save();
      })
      .then(result => { 
        res.status(200).json({ message: 'patient updated!', patient: result });
      })
      .catch(err => {
        next(err);
      });
    }
    
//Patient  can view his profile
exports.ViewMyProfile = (req, res, next) => {
        const userId = req.userId;
        patient.findOne({basicInfo:userId})
        .select('-_id -appointments')
        .populate('basicInfo chronicDiseases history','-email -password')
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
exports.ViewMyhistory = (req ,res, next) =>{
          const patientId = req.userId;
          patient.findOne({basicInfo:patientId})
          .select('history')
          .populate({
            path:'doctors' ,
            select:'-timeslot -speciality -area -fees' ,
            populate:{
              path:'basicInfo',
              select:'-email -password'
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
      }
      //patient can view Appointments
exports.ViewMyAppointments =(req, res, next) =>{
          const patientId = req.UserId;
          patient.findOne({basicInfo:patientId})
          .select('appointments')
          .populate({
              path:'doctors' ,
              select:'-timeslot -speciality -area -fees' ,
              populate:{
                path:'basicInfo',
                select:'-email -password'
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