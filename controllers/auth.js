const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uError = require('../utils/uError');

//function to be implemented
// view All doctors,

//########## Sign up ##########


exports.signup = (req, res, next) => {
    
    const user = new User(req.body).toObject();

    if(user.password!==user.confirmPassword) uError(400,"password don't match");
    if(user.userType!=='Patient'||user.userType!=='Doctor') uError('400','wrong type');

    //##### Hash the password #####
    bcrypt.hash(password, 12)
        .then((hashed) => {
            user.password=hashed;
            return user.save();
        })
        .then(userDoc => {
            console.log('Account created successfully');
            res.status(201)
                .json({ message: 'Account is created successfully', user:userDoc })
        })
        .catch((err) => {
            next(err);
        })


}


//########## log in and get token , user id, and expire Date ##########


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser;
    User.findOne({ email: email })
        //##### Find This email in db #####
        .then(user => {
            if (!user) {uError(401,'This Email is not exists');}

            fetchedUser = user;
            //##### compare password #####
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                uError(401,'Wrong password');
            }
            //##### Create the token #####
            const token = jwt.sign({ userId: fetchedUser._id }, process.env.TOKEN_KEY);
            res.status(202).json(
                {
                    token: token,
                    userId: fetchedUser._id,
                })
        })
        .catch(err => {
            next(err);
        })

}

exports.updateBasicInfo = (req,res,next)=>{

    User.findById(req.userId)
    .select('-email -passoword')
    .populate('userDetails')
    .then(user=>{
        Object.assign(user,req.body);
        return user.save();
    })
    .then(user=>{
        res.status(200).json(user);
    })
    .catch(err=>{
        next(err);
    })
}












