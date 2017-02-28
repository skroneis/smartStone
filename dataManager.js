// =======================
// Data-Manager ================
// =======================
var express = require('express');
var dateFormat = require('dateformat');
var schedule = require('node-schedule');
const arrayLength = 720;    //720 ~ 1h/5sec

var WiGe = [];
var WiRi = [];
var Timestamps = [];
var actuals = null;
var self = null;

//init values (actual)
var modules = module.exports = {
    init: function (values) {
        actuals = values;
        this.ResetMaxMinValues();
        console.log("constructor - Data-Manager...");
        self = this;
    },
    getCardinal: function (degrees) {
        var caridnals = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
        var idx = Math.round((degrees % 360) / 45);
        return caridnals[idx];
    },
    Min: function (arr) {
        return arr.min();
    },
    Max: function (arr) {
        return arr.max();
    },
    Push: function (arrayWiGe, valueWiGe, arrayWiRi, valueWiRi) {
        arrayWiGe.push(parseFloat(valueWiGe));
        arrayWiRi.push(parseFloat(valueWiRi));
        Timestamps.push(Date.now());
        if (arrayWiGe.length > arrayLength) {
            arrayWiGe.shift();
            // console.log("remove (%s)", arrayWiGe.length);
        }
        if (arrayWiRi.length > arrayLength) {
            arrayWiRi.shift();
            // console.log("remove (%s)", arrayWiRi.length);
        }
        if (Timestamps.length > arrayLength) {
            Timestamps.shift();
            // console.log("remove (%s)", Timestamps.length);
        }
    },
    WiGe: function () {
        return WiGe;
    },
    WiRi: function () {
        return WiRi;
    },
    Get: function () {
        var idx = WiGe.lastIndexOf(WiGe.max());
        var idx_min = WiGe.lastIndexOf(WiGe.min());
        actuals.KRO.nodeWiGeMax = WiGe.max();
        actuals.KRO.nodeWiGeWiRiMax = WiRi[idx];
        actuals.KRO.nodeWiGeWiRiMaxStr = this.getCardinal(new Number(WiRi[idx]));
        actuals.KRO.lengthWiGe = WiGe.length;
        actuals.KRO.lengthWiRi = WiRi.length;
        actuals.KRO.lengthTimestamps = Timestamps.length;
        actuals.KRO.wiGeMaxAt = dateFormat(Timestamps[idx], "isoDateTime");
        // actuals.KRO.wiGeMaxAtStr = dateFormat(Timestamps[idx], "dddd, mmmm dS, yyyy, h:MM:ss TT");
        actuals.KRO.nodeWiGeMin = WiGe.min();
        actuals.KRO.nodeWiGeWiRiMin = WiRi[idx_min];
        actuals.KRO.nodeWiGeWiRiMinStr = this.getCardinal(new Number(WiRi[idx_min]));
        actuals.KRO.wiGeMinAt = dateFormat(Timestamps[idx_min], "isoDateTime");
        // actuals.KRO.wiGeMinAtStr = dateFormat(Timestamps[idx_min], "dddd, mmmm dS, yyyy, h:MM:ss TT");
    },
    GetTelegramMessage: function (msg) {
        //console.log("getTelegramMessage...");
        return msg + "Temp " + actuals.KRO.temp + "°C" + "\n" + "Wind: " + getFormattedDataFixed(actuals.KRO.nodeWiGeMax, 0) + '@' + getFormattedDataFixed(actuals.KRO.nodeWiGeWiRiMax, 0);;
    },
    ResetMaxMinValues: function () {
        actuals.CALC.maxTempIn = -99;
        actuals.CALC.minTempIn = 100;
        actuals.CALC.maxTempOut = -99;
        actuals.CALC.minTempOut = 100;
        console.log("  ResetMaxMinValues OK!");
    },
    SaveMinMaxValues: function () {
        if (actuals == null)
            return;

        var tempOut = parseFloat(actuals.KRO.temp);
        var tempIn = parseFloat(actuals.IN.temp);

        if (isNaN(tempOut))
            return;
        if (isNaN(tempIn))
            return;

        if (tempOut >= actuals.CALC.maxTempOut) {
            actuals.CALC.maxTempOut = tempOut;
            actuals.CALC.maxTempOutAt = dateFormat(Date.now(), "isoDateTime");
            // actuals.CALC.maxTempOutAtStr = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
        }
        if (tempOut <= actuals.CALC.minTempOut) {
            actuals.CALC.minTempOut = tempOut;
            actuals.CALC.minTempOutAt = dateFormat(Date.now(), "isoDateTime");
            // actuals.CALC.minTempOutAtStr = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
        }
        if (tempIn >= actuals.CALC.maxTempIn) {
            actuals.CALC.maxTempIn = tempIn;
            actuals.CALC.maxTempInAt = dateFormat(Date.now(), "isoDateTime");
            // actuals.CALC.maxTempInAtStr = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
        }
        if (tempIn <= actuals.CALC.minTempIn) {
            actuals.CALC.minTempIn = tempIn;
            actuals.CALC.minTempInAt = dateFormat(Date.now(), "isoDateTime");
            // actuals.CALC.minTempInAtStr = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
        }
    }    
};

//helper
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

var getFormattedDataFixed = function (str, decimal) {
    var numTempIn = new Number(str);
    var numStr = numTempIn.toFixed(decimal);
    if (numStr == "NaN")
        numStr = "";
    return numStr;
};

//reset values at midnight
schedule.scheduleJob('59 23 * * *', function () {
    self.ResetMaxMinValues();
});
