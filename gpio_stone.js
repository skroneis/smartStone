var gpio = require('rpi-gpio');

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
        gpio.write(pin, true, function(err) {
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
        gpio.write(pin, false, function(err) {
        if (err) throw err;
        console.log('written to pin');
      });
   }
  // gpio.write(pin, false, function(err) {
        // if (err) throw err;
    // });
};

GPIOStone.prototype.read = function (pin) {
    console.log("read: ....: " + pin);
    gpio.read(pin, function(err, value) {
        console.log('The value is ' + value);
    });
};


GPIOStone.prototype.flash = function (pin) {    
	setTimeout(this.setOff, 200, pin);
	setTimeout(this.setOn, 400, pin);
    // this.setOn(pin);
    setTimeout(this.setOff, 600, pin);
};

// GPIOStone.prototype._setOff = function (pin) {
//     self.setOff(pin);
// };

