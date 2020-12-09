const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patientSchema = new Schema({
    chronicDiseases:[{
        type:String
    }],
    history:[{
        doctor:{type:Schema.Types.ObjectId,required:true},
        date:{type:Date,required:true}
    }]
});


module.exports = mongoose.model("Patient", patientSchema);
