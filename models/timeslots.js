const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeslotSchema = new Schema({
    days: [{
        type: String,
        required: true,
        enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }],
    slots: [{
        type: String,
        required: true
    }]

},{versionKey:false});



module.exports = mongoose.model("Timeslot", timeslotSchema);
