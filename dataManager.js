// =======================
// Data-Manager ================
// =======================
var express = require('express');
var dateFormat = require('dateformat');
var schedule = require('node-schedule');
const arrayLength = 720;    //720 ~ 1h/5sec
// var p = [35, 2, 65, 7, 8, 9, 12, 121, 33, 99];
var WiGe = [];
var WiRi = [];
var Timestamps = [];
var actuals = null;

//temp
// var maxTempIn;
// var maxTempInAt;
// var minTempIn;
// var minTempInAt;

// var maxTempOut;
// var maxTempOutAt;
// var minTempOut;
// var minTempOutAt;

//init values (actual)
var modules = module.exports = {
    init: function (values) {
        actuals = values;
        this.ResetMaxMinValues();
        console.log("constructor - Data-Manager...");
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
    // P: function () {
    //     return p;
    // },
    WiGe: function () {
        return WiGe;
    },
    WiRi: function () {
        return WiRi;
    },
    Get: function () {
        // console.log("-------------------- " + WiGe.max());
        // console.log("++++++++++++++++++++++ " + WiRi);
        // console.log("++++++++++++++++++++++ " + WiGe);
        var idx = WiGe.lastIndexOf(WiGe.max());
        var idx_min = WiGe.lastIndexOf(WiGe.min());
        // console.log("INDEX: " + idx);
        // console.log("WiRi: " + WiRi[idx]);
        return {
            idx: idx,
            wiri: WiRi[idx],
            wige: WiGe.max(),
            lengthWiGe: WiGe.length,
            lengthWiRi: WiRi.length,
            wiGeMaxAt: dateFormat(Timestamps[idx], "isoDateTime"),
            wiGeMaxAtStr: dateFormat(Timestamps[idx], "dddd, mmmm dS, yyyy, h:MM:ss TT"),
            lengthTimestamps: Timestamps.length,
            wigeMin: WiGe.min(),
            wiriMin: WiRi[idx_min],
            wiGeMinAt: dateFormat(Timestamps[idx_min], "isoDateTime"),
            wiGeMinAtStr: dateFormat(Timestamps[idx_min], "dddd, mmmm dS, yyyy, h:MM:ss TT")
        };
    },
    GetTelegramMessage: function () {
        //console.log("getTelegramMessage...");
        return "Guten Morgen!\n" + "Temp " + actuals.KRO.temp + "°C" + "\n" + "Wind: " + getFormattedDataFixed(actuals.KRO.nodeWiGeMax, 0) + '@' + getFormattedDataFixed(actuals.KRO.nodeWiGeWiRiMax, 0);;
    },
    ResetMaxMinValues: function () {
        actuals.CALC.maxTempIn = -99;
        actuals.CALC.minTempIn = 100;
        actuals.CALC.maxTempOut = -99;
        actuals.CALC.minTempOut = 100;
    },
    SaveMinMaxValues: function () {
        if (actuals == null)
            return;
        if (actuals.KRO.temp >= actuals.CALC.maxTempOut) {
            actuals.CALC.maxTempOut = actuals.KRO.temp;
            actuals.CALC.maxTempOutAt = Date.now();
        }
        if (actuals.KRO.temp <= actuals.CALC.minTempOut) {
            actuals.CALC.minTempOut = actuals.KRO.temp;
            actuals.CALC.minTempOutAt = Date.now();
        }
        if (actuals.IN.temp >= actuals.CALC.maxTempIn) {
            actuals.CALC.maxTempIn = actuals.IN.temp;
            actuals.CALC.maxTempInAt = Date.now();
        }
        if (actuals.IN.temp <= actuals.CALC.minTempIn) {
            actuals.CALC.minTempIn = actuals.IN.temp;
            actuals.CALC.minTempInAt = Date.now();
        }
        //  return {
        //     maxTempIn: maxTempIn,
        //     maxTempInAt: dateFormat(maxTempInAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        //     minTempIn: minTempIn,
        //     minTempInAt: dateFormat(minTempInAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        //     maxTempOut: maxTempOut,
        //     maxTempOutAt: dateFormat(maxTempOutAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        //     minTempOut: minTempOut,
        //     minTempOutAt: dateFormat(minTempOutAt, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        // };
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
schedule.scheduleJob('0 0 * * *', function(){
  ResetMaxMinValues();
  console.log('ResetMaxMinValues...');
});