const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const doctorSchema = new Schema({
    // When he finishes his data visible becomes true
    visible:{
        type:Boolean,
        default:false
    },
    area:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true,
    },
    fees:{
        type:Number,
        required:true
    },
    patients:[{
        patient: {type:Schema.Types.ObjectId,required:true},
        appointmentCompleted:{type:Boolean,default:false},
        referred:{type:Boolean,default:false}
    }],
    appointments:[{
        patient:{type:Schema.Types.ObjectId,required:true},
        date:{type:Date,required:true}
    }],
    timeSlot:{
        type:Schema.Types.ObjectId,
        ref:'TimeSlot',
        required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review',
    }]
});


module.exports = mongoose.model("Doctor", doctorSchema);
