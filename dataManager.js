// =======================
// Data-Manager ================
// =======================
var express = require('express');
// var p = [35, 2, 65, 7, 8, 9, 12, 121, 33, 99];
var WiGe = [];
var WiRi = [];
//init values (actual)
var modules = module.exports = {
    init: function () {
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
        if (arrayWiGe.length > 1800) {   //1800 ~ 1h
            arrayWiGe.shift();
            console.log("remove (%s)", arrayWiGe.length);
        }
        if (arrayWiRi.length > 1800) {   //1800 ~ 1h
            arrayWiRi.shift();
            console.log("remove (%s)", arrayWiRi.length);
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
        var idx = WiGe.indexOf(WiGe.max());
        // console.log("INDEX: " + idx);
        // console.log("WiRi: " + WiRi[idx]);
        return {
            idx: idx,
            wiri: WiRi[idx],
            wige: WiGe.max(),
            lengthWiGe: WiGe.length,
            lengthWiRi: WiRi.length
        };
    }
};

//helper
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

