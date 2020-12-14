const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patientSchema = new Schema({
    basicInfo:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    chronicDiseases:[{
        type:String
    }],
    appointments:[{
        details:{type:Schema.Types.ObjectId,ref:'Appointment',required:true},
        doctor:{type:Schema.Types.ObjectId,ref:'Doctor',required:true}
    }],
    history:[{
        doctor:{type:Schema.Types.ObjectId,ref:'Doctor',required:true},
        date:{type:Date,required:true}
    }]
},{versionKey:false});


module.exports = mongoose.model("Patient", patientSchema);
