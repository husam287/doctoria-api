const uError = require("./uError");

module.exports = (day)=>{
    //##### For validation #####
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    if(weekdays.indexOf(day,0)===-1) uError(500,'WRONG_DAY_NAME');   

    
    let today= new Date(Date.now());
    let todayDay=today.toLocaleString('en-us', {  weekday: 'long' });
    while (day!==todayDay) {
        today.setDate(today.getDate()+1);
        todayDay=today.toLocaleString('en-us', {  weekday: 'long' });
    }

    return today;
}