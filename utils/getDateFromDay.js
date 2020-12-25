const uError = require("./uError");

module.exports = (day,hour='15:00')=>{
    //##### For validation #####
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    if(weekdays.indexOf(day,0)===-1) uError(400,'WRONG_DAY_NAME');   

    if(hour.toString().length!==5 || hour.toString()[2]!==':') uError(400,'wrong time format');

    const hours = +hour.toString().substr(0,2);
    const mins = +hour.toString().substr(3,2);

    if(!(hours>=0 && hours<=23)) uError(400,'Wrong hours');
    if(!(mins>=0 && mins<=59)) uError(400,'wrong mins');
    
    let today= new Date(Date.now());
    let todayDay=today.toLocaleString('en-us', {  weekday: 'long' });
    while (day!==todayDay) {
        today.setDate(today.getDate()+1);
        todayDay=today.toLocaleString('en-us', {  weekday: 'long' });
    }


    return today;
}