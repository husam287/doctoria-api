const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        
    }, 
    gender:{
        type:String,
        required:true,
        enum: ['Male','Female']
    },
    phone:{
        type:String,
        required:true
    },
    birthday:{
        type:Date,
    },
    address:{
        type:String,
    },
    photo: {
        type: String,
        default: "https://i.imgur.com/TBHW40m.png",
    },
    userType:{
        type:String,
        required:true,
        enum:['Patient','Doctor']
    },
    userDetails:{
        type:Schema.Types.ObjectId,
        refPath:'userType',
    }

});


module.exports = mongoose.model("User", userSchema);
