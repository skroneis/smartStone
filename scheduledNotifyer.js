var schedule = require('node-schedule');
var Notifier = require("./telegramNotify.js");
var notify = new Notifier();

exports = module.exports = ScheduledNotifyer;
var self = null;
var actuals = null;

//constructor
function ScheduledNotifyer() {
    console.log("constructor - ScheduledNotifyer");
    self = this;
}


ScheduledNotifyer.prototype.init = function (data) {
    actuals = data;
    // console.log("~~~~~~~~~~~~~~~~~~ " + actuals.KRO.temp);
    // notify.notifyHtml("Guten Morgen!\nTemp: " + actuals.KRO.temp);
};


schedule.scheduleJob('30 7 * * *', function () {
    notify.notifyHtml("Guten Morgen!\nTemp: " + actuals.KRO.temp);
    console.log("scheduleJob ~~~~~~~~~~~~~~~~~~ " + actuals.KRO.temp);
});


// ScheduledNotifyer.prototype.send = function () {
//     console.log("~~~~~~~~~~~~~~~~~~ " + actuals.temp);
// };