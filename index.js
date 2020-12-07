const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _DB_URL = 'mongodb+srv://doctoria:doctoria123456789@cluster0.rey0l.mongodb.net/doctoria?retryWrites=true&w=majority'

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



//##### using routes #####







//################# ERROR HANDELER #################
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const errorData = error.data;
    res.status(status).json({ message: message, errorData: errorData });
  });



//################# Db connect #################
mongoose
.connect(_DB_URL)
.then(result => {
    console.log('Connected');
  app.listen(process.env.PORT || 8080);
})
.catch(err => console.log(err));

