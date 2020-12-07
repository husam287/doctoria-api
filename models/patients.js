const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patientSchema = new Schema({
    chronicDiseases:[{
        type:String
    }],
    doctors:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }]
});


module.exports = mongoose.model("Patient", patientSchema);
