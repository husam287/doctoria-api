const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const doctorSchema = new Schema({
    //No need to vivible as it will be checked by details.area
    basicInfo:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
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
        type:Schema.Types.ObjectId,
        ref:'Patient',
    }],
    appointments:[{
        type:Schema.Types.ObjectId,
        ref:'Appointment'
    }],
    timeslot:{
        type:Schema.Types.ObjectId,
        ref:'Timeslot',
        //not required ass it will added when needed
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review',
    }]
});


module.exports = mongoose.model("Doctor", doctorSchema);
