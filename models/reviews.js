const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    rate:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5]
    },
    comment:{
        type:String,
    }
},{timestamps:true,versionKey:false});


module.exports = mongoose.model("Review", reviewSchema);
