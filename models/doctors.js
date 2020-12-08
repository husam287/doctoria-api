const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const doctorSchema = new Schema({
    visable:{
        type:Boolean,
        default:true
    },
    area:{
        type:String,
        required:true
    },
    specialization:{
        type:String,
        required:true,
    },
    fees:{
        type:Number,
        required:true
    },
    patients:[{
        type:Schema.Types.ObjectId,
        ref:'User'
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
