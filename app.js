//standard libraries
var util = require('util');

//custom libraries
var netatmo = require("./netatmoHelper");
var logger = require("./logger");
var http = require("./website");
var IR = require("./ir.js");
var ir = new IR(); ir.init();

var ScheduledNotifier = require("./scheduledNotifyer.js");
var scheduledNotifier = new ScheduledNotifier();

//LCD-library
var LCD = require("./lcd.js");
var lcd = new LCD(); lcd.init();

//GPIO (requred)
var api = require("./iControl");
var GpioStone = require('./gpio_stone_wp');
var gpioStone = new GpioStone();

//npm libraries
var schedule = require('node-schedule');
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var events = require('events');
//
var EventEmitter = events.EventEmitter;
var eventEmitter = new events.EventEmitter();
//Maker notifier
var Notifier = require("./telegramNotify.js");
var notify = new Notifier();
// var lirc_node = require('lirc_node');
// lirc_node.init();

//config
var config = require('./config');

// =============================
// global variables ============
// =============================
var actuals = {
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
//init angular values...
//http.update(actuals);
http.init(actuals);
scheduledNotifier.init(actuals);
// lcd.setData(actuals);

// =============================
// UDP listener ================
// =============================
//UDP-Settings
var PORT = config.PORT; //64345;
var HOST = config.HOST; //'255.255.255.255';
// UDP
server.on('listening', function () {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', function (message, remote) {
	// console.log(remote.address + ':' + remote.port + ' - ' + message);
	var msg = JSON.parse(message);
	//console.log("MESSAGE: " + msg.temp);
	actuals.KRO.dateTime = msg.dateTime;
	actuals.KRO.temp = msg.temp;
	actuals.KRO.wiGe = msg.wiGe;
	actuals.KRO.wiRi = msg.wiRi;
	actuals.KRO.wiRiStr = lcd.getCardinal(new Number(msg.wiRi));
	if (msg.wiGeMax != "") {
		actuals.KRO.wiGeMax = msg.wiGeMax;
	}
	actuals.KRO.wiRiWiGeMax = msg.wiRiWiGeMax;
	actuals.KRO.reference = msg.reference;
	/*console.log("dateTime: " + actuals.KRO.dateTime);
	console.log("temp: " + actuals.KRO.temp);
	console.log("reference: " + actuals.KRO.reference);*/
	// http.update(actuals);
	lcd.setData(actuals);
});
server.bind(PORT);

//get measures from netatmo
var getNetatmoMeasures = function () {
	var now = new Date(Date.now());
	netatmo.getMeasuresIn(function (time, temp, co2, humidity, pressure) {
		actuals.IN.time = new Date(time * 1000);
		actuals.IN.temp = temp;
		actuals.IN.co2 = co2;
		actuals.IN.humidity = humidity;
		actuals.IN.pressure = pressure;
		actuals.IN.maturity = new Date(now - actuals.IN.time).getMinutes();
		console.log("TIMESTAMP: " + actuals.IN.time);
		console.log("TEMP: " + actuals.IN.temp);
		console.log("CO2: " + actuals.IN.co2);
		console.log("HUMIDITY: " + actuals.IN.humidity);
		console.log("PRESSURE: " + actuals.IN.pressure);
		console.log("MATURITY: " + actuals.IN.maturity);
	});
	netatmo.getMeasuresOut(function (time, temp, humidity) {
		actuals.OUT.time = new Date(time * 1000);
		actuals.OUT.temp = temp;
		actuals.OUT.humidity = humidity;
		actuals.OUT.maturity = new Date(now - actuals.OUT.time).getMinutes();
		console.log("TIMESTAMP (OUT): " + actuals.OUT.time);
		console.log("TEMP (OUT): " + actuals.OUT.temp);
		console.log("HUMIDITY (OUT): " + actuals.OUT.humidity);
		console.log("MATURITY (OUT): " + actuals.OUT.maturity);
	});

	//update angular values...
	// http.update(actuals);
};

//init (manual)
getNetatmoMeasures();

// =============================
// get netatmo data ============
// =============================
schedule.scheduleJob('*/5 * * * *', function () {
	console.log('every 5 minutes...');
	getNetatmoMeasures();
});

//unix TIMESTAMP
// var date = new Date(1478523562*1000);
// var now = new Date(Date.now());
// console.log (new Date(now-date).getMinutes());


// console.log(gpio.setOn(11));
//console.log(actuals.IN.temp);
// actuals.temp = "1212121";
// console.log(actuals.temp);
// console.log(actuals.co2);

//update angular values...
//http.update(actuals);

//console.log(ir.sayHelloInEnglish());

// var irreceived = function irreceived()
// {
//   console.log('ring ring ring');
// };

// ir.init();
// eventEmitter.on('irReceived', irreceived);

//infrared callback (LED / LCD)
var irCallback = function (data) {
	console.log("callback...");
	console.log(data.key);
	if (data.key == "KEY_PLAY") {
		gpioStone.setOn(gpioStone.LED_GREEN);
	}
	else if (data.key == "KEY_ENTER") {
		gpioStone.setOff(gpioStone.LED_GREEN);
	}
	else if (data.key == "KEY_UP") {
		actuals.page = actuals.page + 1;
		console.log(actuals.page);
		gpioStone.flash(gpioStone.LED_GREEN);
	}
	else if (data.key == "KEY_DOWN") {
		actuals.page = actuals.page - 1;
		if (actuals.page <= 0)
			actuals.page = 1;
		console.log(actuals.page);
		gpioStone.flash(gpioStone.LED_GREEN);
	}
	else if (data.key == "KEY_MENU") {
		// console.log("KEY_MENU");
		// console.log(actuals.KRO.temp);
		gpioStone.flash(gpioStone.LED_GREEN);
		notify.notify("Temp: " + actuals.KRO.temp);
	}
};

ir.addListener("KEY_PLAY", irCallback);
ir.addListener("KEY_ENTER", irCallback);
ir.addListener("KEY_UP", irCallback);
ir.addListener("KEY_DOWN", irCallback);
ir.addListener("KEY_MENU", irCallback);

// ir.test();
//util.inherits(ir, EventEmitter);

// ir.on('event', function (message) {
//   console.log('A');
// });

//TEST
//gpioStone.setOn(gpioStone.LED_GREEN);
//gpioStone.setOff(gpioStone.LED_GREEN);
//gpioStone.flash(gpioStone.LED_GREEN);
//gpioStone.setOff(gpioStone.LED_GREEN);
// var listenerId = lirc_node.addListener(function(data) {
// console.log("Received IR keypress '" + data.key + "' from remote '" + data.remote +"'");
// });

logger.info("----app.js END----");
