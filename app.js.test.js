// var Notifier = require("./telegramNotify.js");
// var notify = new Notifier();
// notify.notifyHtml("Hello World! 1<i>BOLD!!!</i>");

var ScheduledNotifier = require("./scheduledNotifyer.js");
var scheduledNotifier = new ScheduledNotifier();

var actuals = {
	temp: 12.3
};

scheduledNotifier.init(actuals);

// actuals.temp = 15.5;
// scheduledNotifier.send();

// var GpioStone = require('./gpio_stone_wp');
// var gpioStone = new GpioStone();
// gpioStone.flash(gpioStone.LED_GREEN);


/*var pad = require('pad');
// var LCD = require("./lcd.js");
// var lcd = new LCD();lcd.init();

var Notifier = require("./notify.js");
var notify = new Notifier();

var Smtp = require("./smtp.js");
var smtp = new Smtp();
// =============================
// global variables ============
// =============================
var actuals = {
	IN: {
		temp: "25.8",
		co2: " - ",
		humidity: " - ",
		pressure: " - "
	},
	OUT: {
		temp: " - ",
		humidity: " - "
	},
	KRO: {
		dateTime: "",
		temp: "12.5",
		wiGe: "2.9",
		wiRi: "180",
		wiGeMax: "0",
		wiRiWiGeMax: "",
		reference: "0"
	}
	//   greeting: function () {
	//     return "Hello " + this.name + ".  Wow, you are " + this.age + " years old.";
	//   }
};

//OK?
//lcd.setData(actuals);

//OK
//http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
//notify.notify("Hello World! 1");

var lines = {
	getLine: function (idx) {
		return pad(this._lines[idx].content, 20) + "*";
	},
	setLine: function (idx, data) {
		this._createLine(idx, data);
		this._lines[idx].content = data.val;
		return this._lines[idx].content;
	},
	_createLine: function (idx, data) {
		if (this._lines[idx] === undefined) {
			this._lines.push({id: idx, content: "EMPTY LINE"});
		}
	},
	_lines:
	[
		{
			id: 1,
			content: "line 1"
		},
		{
			id: 2,
			content: "line 2"
		}
	]
};

lines.setLine(2, { val: "SeppForcher" });
console.log(lines.getLine(0));
console.log(lines._lines);

//SMTP mail
// smtp.sendMail("smartStone", "<b>Sepp Forcher</b>");

*/


