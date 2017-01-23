var gpio = require('rpi-gpio');
var fs = require("fs");

exports = module.exports = GPIOStone;
var self = null;

function GPIOStone() {
    console.log("constructor - GPIOStone");
    self = this;
    this.LED_RED = 12;
    this.LED_GREEN = 11;
    this.LED_BLUE = 13;
    this.LED_WHITE = 14;

    // gpio.setup(this.LED_RED, gpio.DIR_OUT);
    // gpio.setup(this.LED_GREEN, gpio.DIR_OUT);
    // gpio.setup(this.LED_BLUE, gpio.DIR_OUT);
    // gpio.setup(this.LED_WHITE, gpio.DIR_OUT);
}

GPIOStone.prototype.setOn = function (pin) {
    console.log("ON: ....: " + pin);
    gpio.setup(pin, gpio.DIR_OUT, write);
    function write() {
        gpio.write(pin, true, function (err) {
            if (err) throw err;
            console.log('written to pin');
        });
    }
    // gpio.write(pin, true, function(err) {
    // if (err) throw err;
    // });
};

GPIOStone.prototype.setOff = function (pin) {
    console.log("OFF: ....: " + pin);
    gpio.setup(pin, gpio.DIR_OUT, write);
    function write() {
        gpio.write(pin, false, function (err) {
            if (err) throw err;
            console.log('written to pin');
        });
    }
    // gpio.write(pin, false, function(err) {
    // if (err) throw err;
    // });
};

GPIOStone.prototype.read = function (pin, callback) {
    console.log("read: ....: " + pin);
    pin = sanitizePinNumber(pin);
    //const value = fs.readFileSync('/sys/class/gpio/gpio23/value').toString();
    // var contents = fs.readFileSync('/sys/class/gpio/gpio17/value').toString();
    // console.log(contents);
    //var path = '/sys/class/gpio/gpio' + pinMapping[pin] + '/value';
    //console.log (path);
    fs.readFile('/sys/class/gpio/gpio' + pinMapping[pin] + '/value', function (err, data) {
        if (err) return (callback || noop)(err);
        //console.log (data.toString());
        (callback || noop)(null, parseInt(data, 10));
    });

    // var buffer = fs.readFile('/sys/class/gpio/gpio7/value', function (err, data) {
    //     console.log (buffer.toString());
    // });
    //console.log(value);
    /*gpio.setup(pin, gpio.DIR_IN, readInput);
    function readInput() {
        gpio.read(pin, function (err, value) {
            console.log('The value is ' + value);
        });
    }*/
};


GPIOStone.prototype.flash = function (pin) {
    setTimeout(this.setOff, 200, pin);
    setTimeout(this.setOn, 400, pin);
    // this.setOn(pin);
    setTimeout(this.setOff, 600, pin);
};

var rev = fs.readFileSync("/proc/cpuinfo").toString().split("\n").filter(function(line) {
	return line.indexOf("Revision") == 0;
})[0].split(":")[1].trim();
rev = parseInt(rev, 16) < 3 ? 1 : 2; 
var pinMapping = {
	"3": 0,
	"5": 1,
	"7": 4,
	"8": 14,
	"10": 15,
	"11": 17,
	"12": 18,
	"13": 21,
	"15": 22,
	"16": 23,
	"18": 24,
	"19": 10,
	"21": 9,
	"22": 25,
	"23": 11,
	"24": 8,
	"26": 7,

	// Model A+ and Model B+ pins
	"29": 5,
	"31": 6,
	"32": 12,
	"33": 13,
	"35": 19,
	"36": 16,
	"37": 26,
	"38": 20,
	"40": 21
};

if (rev == 2) {
	pinMapping["3"] = 2;
	pinMapping["5"] = 3;
	pinMapping["13"] = 27;
}

//revision
//console.log (rev);

function isNumber(number) {
	return !isNaN(parseInt(number, 10));
}

function sanitizePinNumber(pinNumber) {
    if (!isNumber(pinNumber) || !isNumber(pinMapping[pinNumber])) {
        throw new Error("Pin number isn't valid");
    }

    return parseInt(pinNumber, 10);
}

function noop() {}

// GPIOStone.prototype._setOff = function (pin) {
//     self.setOff(pin);
// };

