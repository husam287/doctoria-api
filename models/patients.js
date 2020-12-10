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
    history:[{
        doctor:{type:Schema.Types.ObjectId,ref:'Doctor',required:true},
        date:{type:Date,required:true}
    }]
});


module.exports = mongoose.model("Patient", patientSchema);
