const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rate:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5]
    },
    comment:{
        type:String,
    }
},{timestamps:true});


module.exports = mongoose.model("Review", reviewSchema);
