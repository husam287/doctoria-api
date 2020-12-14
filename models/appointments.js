const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const appointmentsSchema = new Schema({
    patient:{type:Schema.Types.ObjectId,ref:'Patient',required:true},
    date:{type:Date},
    completed:{type:Boolean,default:false},
    referred:{type:Boolean,default:false}
},{versionKey:false});

module.exports = mongoose.model("Appointment",appointmentsSchema);

