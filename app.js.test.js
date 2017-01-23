/*var http = require("./website.test");
var actuals = {
	IN: {
		temp: "25"
	}
};

http.init(actuals);*/

/**********NETATMO*********************/
//var netatmo = require("./netatmoHelper");
// netatmo.init();
/*netatmo.getMeasuresIn(function (time, temp, co2, humidity, pressure) {
	console.log("TEMP: " + temp);

	netatmo.getAccessToken(function (access_token) {
		console.log("Access_token");
		console.log(access_token);

		//refresh
		netatmo.refreshAccessToken(function (result) {
			netatmo.getMeasuresIn(function (time, temp, co2, humidity, pressure) {
				console.log("TEMP 2: " + temp);
				//new token?
				netatmo.getAccessToken(function (access_token) {
					console.log("new ? Access_token");
					console.log(access_token);
				});
			});
		});		
	});
});*/

// netatmo.getMeasuresIn(function (time, temp, co2, humidity, pressure) {
// 	console.log("TEMP: " + temp);
// });


//GPIO STONE
var GpioStone = require('./gpio_stone');
var gpioStone = new GpioStone();
gpioStone.read(11, function (err, pin_value){
	console.log (pin_value);
});

// netatmo = null;
// netatmo = require("./netatmoHelper");

// netatmo.getMeasuresIn(function (time, temp, co2, humidity, pressure) {
// 	console.log("TEMP: " + temp);
// });


/*var tempOut = parseFloat("1#");
if (tempOut instanceof Error) {
	console.log("ERROR!!!");
}

if (isNaN(tempOut))
	console.log("isNaN!!!");

console.log(tempOut);*/

// var dataManager = require("./dataManager");

/*
dataManager.init();
// console.log(dataManager.P);
// dataManager.Min(dataManager.P());

dataManager.Push(dataManager.WiGe(), 6.23, dataManager.WiRi(), 269.30);
dataManager.Push(dataManager.WiGe(), 10.93, dataManager.WiRi(), 298.39);
dataManager.Push(dataManager.WiGe(), 11.60, dataManager.WiRi(), 301.29);
dataManager.Push(dataManager.WiGe(), 10.50, dataManager.WiRi(), 271.14);
dataManager.Push(dataManager.WiGe(), 10.51, dataManager.WiRi(), 271.15);
dataManager.Push(dataManager.WiGe(), 11.60, dataManager.WiRi(), 101.29);

//console.log(dataManager.Min(dataManager.WiGe()));
// console.log(dataManager.Max(dataManager.WiGe()));
//console.log(dataManager.WiGe().length);
// console.log(dataManager.WiRi());

var retVal = dataManager.Get();
console.log(retVal.wige + " @" + retVal.wiri + " --> " + retVal.wiGeMaxAt);*/
/*var actuals = {
	IN: {
		temp: " - ",
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
		temp: " - ",
		wiGe: " - ",
		wiRi: " - ",
		wiRiStr: " - ",
		wiGeMax: " - ",
		wiRiWiGeMax: " - ",
		reference: " - "
	},
	page: 1
	//   greeting: function () {
	//     return "Hello " + this.name + ".  Wow, you are " + this.age + " years old.";
	//   }
};
dataManager.init(actuals);
console.log(dataManager.GetTelegramMessage());*/

// console.log(retVal.idx);
// console.log(retVal.wiri);

// var Notifier = require("./telegramNotify.js");
// var notify = new Notifier();
// notify.notifyHtml("Hello World! 1<i>BOLD!!!</i>");

// var ScheduledNotifier = require("./scheduledNotifyer.js");
// var scheduledNotifier = new ScheduledNotifier();

// var actuals = {
// 	temp: 12.3
// };

// scheduledNotifier.init(actuals);

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


