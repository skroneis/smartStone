var pad = require('pad');
var moment = require('moment');
var schedule = require('node-schedule');

var LCD = require('lcdi2c');
var lcd = new LCD(1, 0x27, 20, 4);

//special LCD characters
//OUT: 0
lcd.createChar(0, [0x11, 0xa, 0xe, 0x1f, 0xe, 0xa, 0x11]);
//IN: 1
lcd.createChar(1, [0x4, 0xa, 0x11, 0x1f, 0x11, 0x11, 0x1f]);
//GradC
lcd.createChar(3, [0x18, 0x18, 0x3, 0x4, 0x4, 0x4, 0x3]);
//clock
lcd.createChar(4, [0x0, 0xe, 0x15, 0x17, 0x11, 0xe, 0x0]);
//co2
lcd.createChar(5, [0x0, 0x0, 0x1c, 0x4, 0x1c, 0x10, 0x1c]);

// LCD ERROR HANDLING
if (lcd.error) {
    lcdErrorHandler(lcd.error);
}
// LCD ERROR HANDLING
function lcdErrorHandler(err) {
    console.log('Unable to print to LCD display on bus 1 at address 0x27');
    logger.error('Unable to print to LCD display on bus 1 at address 0x27');
};

exports = module.exports = LCDStone;
var self = null;

/*var lines = {
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
};*/

var lines = {
    getLine: function (idx) {
        return pad(this._lines[idx].content, 20); // + "*";
    },
    setLine: function (idx, data) {
        //create line if it does not exist in array
        this._createLine(idx, data);
        if (idx == 0) {
            this._lines[idx].content = "TMP " + String.fromCharCode(0) + " " + getFormattedData(data.KRO.temp) + String.fromCharCode(3) + " " + String.fromCharCode(1) + " " + getFormattedData(data.IN.temp) + String.fromCharCode(3);
        } else if (idx == 1) {
            this._lines[idx].content = 'WiGe ' + getFormattedDataFixed(data.KRO.wiGe, 1) + ' MAX ' + getFormattedDataFixed(data.KRO.nodeWiGeMax, 0) + '@' + getFormattedDataFixed(data.KRO.nodeWiGeWiRiMax, 0);
        } else if (idx == 2) {
            this._lines[idx].content = 'WiRi ' + getFormattedDataFixed(data.KRO.wiRi, 1) + " (" + self.getCardinal(new Number(data.KRO.wiRi)) + ")";
        } else if (idx == 3) {
            this._lines[idx].content = "CO" + String.fromCharCode(5) + " " + data.IN.co2 + "  ";
        } else if (idx == 4) {
            this._lines[idx].content = "Alter: " + data.IN.maturity;
        } else if (idx == 5) {
            this._lines[idx].content = "Array: " + data.KRO.lengthWiGe + " " + data.KRO.lengthWiRi;
        } else if (idx == 6) {
            this._lines[idx].content = "";
        } else if (idx == 7) {
            this._lines[idx].content = "";
        }

        //TODO...
        return this._lines[idx].content;
    },
    _createLine: function (idx, data) {
        if (this._lines[idx] === undefined) {
            this._lines.push({ id: idx, content: "EMPTY LINE" });
        }
    },
    _lines:
    [
        {
            id: 1,
            content: ""
        },
        {
            id: 2,
            content: ""
        },
        {
            id: 3,
            content: ""
        },
        {
            id: 4,
            content: ""
        }
    ],
    getTelegramMessage: function (data) {
        return 
    }
};

//constructor
function LCDStone() {
    console.log("constructor - LCDStone");
    self = this;
};


//init
LCDStone.prototype.init = function () {
    console.log("initializing LCD...");
    lcd.println('initializing...', 1);
    lcd.on();
};

LCDStone.prototype.getTelegramMessage = function(data) {
    return lines.getTelegramMessage(data);
};

LCDStone.prototype.setData = function (data) {
    // console.log("setLCDData...");
    // console.log(data.IN.temp);
    // var numTempIn = new Number("2.5");
    // var numStr = numTempIn.toFixed(2);
    // console.log(numStr);
    // lines.L1 = lines.L1 + " " + numStr;
    // console.log(lines.getL2() + "X");

    console.log("page: " + data.page);
    // actuals.IN.maturity

    //page 1
    if (data.page == 1) {
        lines.setLine(0, data);
        lines.setLine(1, data);
        lines.setLine(2, data);
        lines.setLine(3, data);

        console.log(lines.getLine(0));
        console.log(lines.getLine(1));
        console.log(lines.getLine(2));
        console.log(lines._lines[3].content);

        //print to LCD...
        lcd.println(lines.getLine(0), 1);
        lcd.println(lines.getLine(1), 2);
        lcd.println(lines.getLine(2), 3);
        lcd.setCursor(0, 3)
        lcd.print(lines._lines[3].content + "  ");
    }
    //page 2
    else if (data.page == 2) {
        // lcd.clear();
        lines.setLine(4, data);
        lines.setLine(5, data);
        lines.setLine(6, data);
        lines.setLine(7, data);

        console.log(lines.getLine(4));
        console.log(lines.getLine(5));
        console.log(lines.getLine(6));
        console.log(lines.getLine(7));

        lcd.println(lines.getLine(4), 1);
        lcd.println(lines.getLine(5), 2);
        lcd.println(lines.getLine(6), 3);
        lcd.println(lines.getLine(7), 4);
    }
};


// Display actual time
var timerInterval = function () {
    var time = moment().format('HH:mm:ss');
    //console.log(time);
    lcd.setCursor(11, 3);
    lcd.print(String.fromCharCode(4))
    lcd.print(time);
    lcd.home();
}
setInterval(timerInterval, 100)

//helper
var getFormattedData = function (str) {
    var numTempIn = new Number(str);
    // console.log("XXXXXXXXXXXXXXXXXX" + numTempIn);
    var numStr = numTempIn.toFixed(2);
    if (numStr == "NaN")
        numStr = "";
    return numStr;
};

var getFormattedDataFixed = function (str, decimal) {
    var numTempIn = new Number(str);
    // console.log("XXXXXXXXXXXXXXXXXX" + numTempIn);
    var numStr = numTempIn.toFixed(decimal);
    if (numStr == "NaN")
        numStr = "";
    return numStr;
};

//var getCardinal = function (degrees)
LCDStone.prototype.getCardinal = function(degrees) {
    var caridnals = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    var idx = Math.round((degrees % 360) / 45);
    return caridnals[idx];
};


//schedul LCD
//schedule - display backlight off
schedule.scheduleJob('0 23 * * *', function(){
  lcd.off();
  console.log('display off!');
});
schedule.scheduleJob('30 6 * * *', function(){
  lcd.on();
  console.log('display on!');
});
schedule.scheduleJob('0 9 * * 1-5', function(){
  //lcd.off();
  console.log('display off!');
});
schedule.scheduleJob('0 17 * * 1-5', function(){
  lcd.on();
  console.log('display on!');
});