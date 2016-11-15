var pad = require('pad');
var moment = require('moment');

var LCD = require('lcdi2c');
var lcd = new LCD( 1, 0x27, 20, 4 );

//special LCD characters
//OUT: 0
lcd.createChar(0,[0x11,0xa,0xe,0x1f,0xe,0xa,0x11]);
//IN: 1
lcd.createChar(1,[0x4,0xa,0x11,0x1f,0x11,0x11,0x1f]);
//GradC
lcd.createChar(3,[0x18,0x18,0x3,0x4,0x4,0x4,0x3]);
//clock
lcd.createChar(4,[0x0,0xe,0x15,0x17,0x11,0xe,0x0]);
//co2
lcd.createChar(5,[0x0,0x0,0x1c,0x4,0x1c,0x10,0x1c]);

// LCD ERROR HANDLING
if ( lcd.error ) { 
    lcdErrorHandler( lcd.error );
}
// LCD ERROR HANDLING
function lcdErrorHandler( err ) {
    console.log( 'Unable to print to LCD display on bus 1 at address 0x27' );
	logger.error('Unable to print to LCD display on bus 1 at address 0x27');
};

exports = module.exports = LCDStone;
var self = null;

var lines = {
    L1: "",
    L2: "",
    L3: "",
    L4: "",
    getL1: function () {
        return pad(lines.L1, 20);
    },
    getL2: function () {
        return pad(lines.L2, 20);
    },
    getL3: function () {
        return pad(lines.L3, 20);
    },
    getL4: function () {
        return pad(lines.L4, 20);
    },
    setLine1: function (data) {
        this.L1 = "TMP " + String.fromCharCode(0) + " " + getFormattedData(data.KRO.temp) + String.fromCharCode(3) + " " + String.fromCharCode(1) + " " + getFormattedData(data.IN.temp) + String.fromCharCode(3);
        return this.L1;
    },
    setLine2: function (data) {
        this.L2 = 'WiGe ' + getFormattedData(data.KRO.wiGe) + ' MAX ' + getFormattedData(data.KRO.wiGeMax);
        return this.L2;
    },
    setLine3: function (data) {
        this.L3 = 'WiRi ' + getFormattedData(data.KRO.wiRi) + " (" + getCardinal(new Number(data.KRO.wiRi)) + ")";
        return this.L3;
    },
    setLine4: function (data) {
        this.L4 = "CO" + String.fromCharCode(5) + " " + data.IN.co2 + "  ";
        return this.L4;
    }
};

function LCDStone() {
    console.log("constructor - LCDStone");
    self = this;
};


//init
LCDStone.prototype.init = function () {
    console.log("initializing...");
    lcd.println('initializing...', 1);
    lcd.on();
};

LCDStone.prototype.setData = function (data) {
    // console.log(data.IN.temp);
    // var numTempIn = new Number("2.5");
    // var numStr = numTempIn.toFixed(2);
    // console.log(numStr);
    // lines.L1 = lines.L1 + " " + numStr;
    // console.log(lines.getL2() + "X");
    lines.setLine1(data);
    lines.setLine2(data);
    lines.setLine3(data);
    lines.setLine4(data);

    console.log(lines.getL1());
    console.log(lines.getL2());
    console.log(lines.getL3());
    console.log(lines.L4);    
    //lcd.println(setLine1(data), 1);
    //TODO for line 4 (!):
    // lcd.setCursor(0,3)
	// lcd.print
};


// Display actual time
var timerInterval = function () {
    var time = moment().format('HH:mm:ss');
    //console.log(time);
	/*lcd.setCursor(11,3);
	lcd.print(String.fromCharCode(4))
	lcd.print(time);
	lcd.home();*/
    //lcd.println(0,4);
    // lcd.setCursor(0,4);
    // lcd.write('0');
}
setInterval(timerInterval, 100)

var getFormattedData = function (str) {
    var numTempIn = new Number(str);
    var numStr = numTempIn.toFixed(2);
    return numStr;
};

//var getCardinal = function (degrees)
function getCardinal(degrees) {
    var caridnals = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    var idx = Math.round((degrees % 360) / 45);
    return caridnals[idx];
};