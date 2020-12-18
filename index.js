const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _DB_URL = process.env.MONGO_URL;


if(process.env.NODE_ENV != "production") require("dotenv").config();
//##### main express function #####
const app = express();

//##### body parser #####
app.use(bodyParser.json());

//##### allowing required header #####
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
  
  })
  

  
//##### importing Routes #####
const authRouter = require('./routes/auth');
const doctorsRouter = require('./routes/doctors');
//const patientsRouter = require('./routes/patient');

//##### using routes #####
app.use("/api/users",authRouter);
app.use("/api/doctors",doctorsRouter);
//app.use("/api/patients",patientsRouter);




//################# ERROR HANDELER #################
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.errorCode || error.message;
    const errorData = error.data;
    res.status(status).json({ message: message, errorData: errorData });
  });



//################# Db connect #################
mongoose
.connect(_DB_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result => {
    console.log('Connected');
  app.listen(process.env.PORT || 8080);
})
.catch(err => console.log(err));

