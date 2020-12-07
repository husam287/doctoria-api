const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const timeSlotSchema = new Schema({
    days:[{
        type:String,
        required:true,
        enum:['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
    }],
    time:[{
        type:String,
        required:true
    }]
    
});


module.exports = mongoose.model("TimeSlot", timeSlotSchema);
