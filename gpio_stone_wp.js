var wpi = require('wiring-pi');
wpi.setup('wpi');

exports = module.exports = GPIOStone;
var self = null;

function GPIOStone() {
    console.log("constructor - GPIOStoneWP");
    self = this;
    this.LED_GREEN = 0;
    this.LED_RED = 1;
    this.LED_BLUE = 2;
    this.LED_WHITE = 3;  
    
    wpi.pinMode(this.LED_GREEN, wpi.OUTPUT);
    //wpi.pinMode(this.LED_RED, wpi.OUTPUT);
    //wpi.pinMode(this.LED_BLUE, wpi.OUTPUT);    
    //wpi.pinMode(this.LED_WHITE, wpi.OUTPUT);
}

GPIOStone.prototype.setOn = function (pin) {
    // console.log("ON: ....: " + pin);
    wpi.digitalWrite(pin, 1);
};

GPIOStone.prototype.setOff = function (pin) {
    // console.log("OFF: ....: " + pin);
    wpi.digitalWrite(pin, 0);
};

GPIOStone.prototype.flash = function (pin) {
    this.setOff(pin);
    //setTimeout(this.setOff, 200, pin);
    this.setOn(pin);
    setTimeout(this.setOff, 50, pin);
    // this.setOff(pin);
    //setTimeout(this.setOff, 600, pin);
};

// var pin = 0;
// wpi.pinMode(pin, wpi.OUTPUT);
// var value = 1;
// setInterval(function() {
//   wpi.digitalWrite(pin, value);
//   value = +!value;
// }, 500);

