const getDateFromDay = require("../utils/getDateFromDay")

exports.test = (req, res, next) => {
    console.log(getDateFromDay('Sunday'));
    next();
}