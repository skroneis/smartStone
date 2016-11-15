// var gpio = require('rpi-gpio');
// gpio.setup(11, gpio.DIR_OUT, write);
 
// function write() {
    // gpio.write(11, false, function(err) {
        // if (err) throw err;
        // console.log('Written to pin');
    // });
// }
var gpio = require('rpi-gpio');

exports.setOn = function(pin) {
	gpio.setup(pin, gpio.DIR_OUT, write);
	 function write() {
       gpio.write(pin, true, function(err) {
       if (err) throw err;
       console.log('written to pin');
     });
  }
  //return 'Hello!';
}

exports.setOff = function(pin) {
	gpio.setup(pin, gpio.DIR_OUT, write);
	 function write() {
       gpio.write(pin, false, function(err) {
       if (err) throw err;
       console.log('written to pin');
     });
  }
  //return 'Hello!';
}
