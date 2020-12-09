const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const doctorSchema = new Schema({
    //No need to vivible as it will be checked by details.area
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
        //not required ass it will added when needed
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review',
    }]
});


module.exports = mongoose.model("Doctor", doctorSchema);
