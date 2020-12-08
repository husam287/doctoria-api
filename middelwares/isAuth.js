const jwt=require('jsonwebtoken')
const uError = require('../utils/uError');

module.exports=(req,res,next)=>{
    if(!req.get('Authorization')){
        uError(401,'token is not define');
    }
    
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,process.env.TOKEN_KEY)
    } catch (error) {
        error.statusCode=500;
        throw error;
    }
    if(!decodedToken){
        uError(401,'Not Authorized');
    }
    req.userId=decodedToken.userId;
    next();
}