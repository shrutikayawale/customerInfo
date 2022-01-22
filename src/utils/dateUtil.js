const moment = require('moment');

export const getAge = (dob) => (Math.floor(moment(new Date()).diff(moment(dob,"YYYY-MM-DD"),'years',true)));