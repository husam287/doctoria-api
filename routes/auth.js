const router = require('express').Router();
const authController = require('../controllers/auth');
const { vEmail, vPassword, vRepeated, vText, validationResult } = require('../middelwares/validation')
const {body} = require('express-validator');
const User = require('../models/users');
const isAuth = require('../middelwares/isAuth')

//email,password,name to sign up
router.post('/signup', [
    //Email validation
    vEmail('email'),
    vRepeated('email',{Model:User,modelFieldName:'email',shouldExist:false}),
    //password validation
    vPassword('password'),
    vText('name',{required:true,max:40}),
    vText('gender',{required:true}),
    body('phone').isMobilePhone('ar-EG'),
    vText('userType',{required:true}),
    validationResult
],
    authController.signup)

router.post('/login', authController.login)

router.patch('/update-basic-info',[
    isAuth,
    vText('name',{required:true,max:40}),
    body('phone').isMobilePhone('ar-EG'),
    validationResult
],authController.updateBasicInfo)






module.exports = router;